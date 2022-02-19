import { MongoClient, ServerApiVersion } from "mongodb";
import cliProgress from "cli-progress";

import { User } from "./services/storage/User";
import { Artist } from "./services/storage/Artist";
import { Song } from "./services/storage/Song";
import { Favorites } from "./services/storage/Favorites";

console.log("Running MongoDB -> MariaDB Migration");

type UnixDate_needs_ms = number;
type Song_needs_trim = string;

interface FavoriteSong {
    song: Song_needs_trim;
    date: UnixDate_needs_ms;
}

interface UserFavoriteDocument {
    _id: string;
    user: string;
    songs: FavoriteSong[];
}

async function getMongo() {
    const uri =
        "mongodb+srv://botsuro:KYZD5TEsGPlxSdTb@botsuro.easqi.mongodb.net/devDb?retryWrites=true&w=majority";

    const client = new MongoClient(uri, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    });

    return await client.connect();
}

async function main() {
    console.log("Connecting to MongoDB");
    const mongo = await getMongo();
    console.log("...OK");

    console.log("Assigning collection vars");
    const userFaves = mongo.db("devDb").collection("saved_songs");
    console.log("...OK");

    console.log("Creating DB access services");
    const u = new User(),
        a = new Artist(),
        s = new Song(),
        f = new Favorites();
    console.log("...OK");

    console.log("Getting user-favorite objects from Mongo");
    const userObjects = (await userFaves
        .find()
        .toArray()) as unknown as Array<UserFavoriteDocument>;
    console.log(`> Found ${userObjects.length} documents`);
    console.log("...OK");

    console.log("Writing user objects to new DB");
    const userBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
    );

    userBar.start(userObjects.length, 0);
    for (const obj of userObjects) {
        await u.findOrCreate(obj.user);
        userBar.increment(1);
    }
    userBar.stop();
    console.log("...OK");

    console.log("Creating favorite songs in new DB");
    // Loop through the same userobjects
    for (const obj of userObjects) {
        const bar = new cliProgress.SingleBar(
            {},
            cliProgress.Presets.shades_classic
        );
        console.log(`> Saving favorites for ${obj.user}`);
        bar.start(obj.songs.length, 0);

        // This is a single use script so I'm not going to optimize DB reads
        const user = await u.findOrCreate(obj.user);
        for (const songObject of obj.songs) {
            // Songs come in as a combo artist song string
            const [artist, song] = songObject.song
                .split("-")
                .map((s) => s.trim());

            const savedArtist = await a.findOrCreate(artist);
            const savedSong = await s.findOrCreate(savedArtist.id, song);

            // Create a new favorites entry using new artist and song
            await f.TEMP_IMPORT_ERROR_OVERRIDE(
                user.id,
                savedSong.id,
                new Date(songObject.date * 1000)
            );

            bar.increment();
        }
        bar.stop();
    }
    console.log("...OK");

    console.log("Disconnecting from MongoDB");
    console.log("...OK");

    console.log("Cleaning up");
    await mongo.close();
    console.log("...OK");
}

main()
    .then(() => console.log("Done! You can now use the new DB :)"))
    .catch((e) => console.error(e));

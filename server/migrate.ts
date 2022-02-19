import { MongoClient, ServerApiVersion } from "mongodb";
import cliProgress from "cli-progress";

import { User } from "./services/storage/User";
import { Artist } from "./services/storage/Artist";
import { Song } from "./services/storage/Song";
import { Favorites } from "./services/storage/Favorites";
import { Request } from "./services/storage/Request";

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

interface RequestDocument {
    _id: string;
    user: string;
    artist: string;
    song_title: string;

    // Some have requested dates
    request_date?: number;

    // Meta
    ripped?: boolean;
    streamed?: number;
    stream_date?: string;
    owned?: boolean;
    notes?: string;
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
    const userRequests = mongo.db("devDb").collection("requests");
    console.log("...OK");

    console.log("Creating DB access services");
    const u = new User(),
        a = new Artist(),
        s = new Song(),
        f = new Favorites(),
        r = new Request();
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

    console.log("Reading request history");
    const requests = (await userRequests
        .find()
        .toArray()) as unknown as RequestDocument[];
    console.log(`> Found ${requests.length} requests`);
    console.log("...OK");

    console.log("Saving requests to new DB");
    const requestsBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
    );
    requestsBar.start(requests.length, 0);
    for (const req of requests) {
        const user = await u.findOrCreate(req.user);
        await r.findOrCreate(
            user.id,
            `${req.artist} - ${req.song_title}`,
            {
                requested: req.request_date
                    ? new Date(req.request_date * 1000)
                    : undefined,
                played: req.stream_date ? new Date(req.stream_date) : undefined,
            },
            {
                ripped: req.ripped,
                streamed: Boolean(req.streamed),
                ownedStatus: req.owned,
                notes: req.notes,
            }
        );

        requestsBar.increment();
    }
    requestsBar.stop();

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

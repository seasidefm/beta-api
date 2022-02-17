import fs from "fs";

import { User } from "./services/storage/User";
import { Artist } from "./services/storage/Artist";
import { Song } from "./services/storage/Song";
import { Favorites } from "./services/storage/Favorites";

interface JSONStructure {
    user: string;
    songs: Array<{
        song: string;
        date: number;
    }>;
}

type FileContents = Array<JSONStructure>;

async function main() {
    const args = process.argv;
    if (args.length !== 4) {
        throw new Error("Cannot find expected arg structure: -f JSON_FILE");
    }
    console.log("Using file ->", args[3]);
    const contents = fs.readFileSync(args[3]).toString("utf-8");
    const parsed = JSON.parse(contents);

    console.log("Checking file structure");
    if (!Array.isArray(parsed)) {
        throw new Error("Expected JSON structure to be an array!");
    }
    console.log("...OK");

    console.log("Checking data structures");
    parsed.forEach((entry, index) => {
        if (!entry.user) {
            throw new Error(`Malformed entry parsed[${index}]. No 'user' key!`);
        }

        if (!entry.songs) {
            throw new Error(
                `Malformed entry parsed[${index}]. No 'songs' key!`
            );
        }

        entry.songs.forEach((s: Record<string, any>, i: number) => {
            if (!s.song) {
                throw new Error(
                    `Malformed entry parsed[${index}][${i}]. No 'song' key!`
                );
            }

            if (!s.date) {
                throw new Error(
                    `Malformed entry parsed[${index}][${i}]. No 'date' key!`
                );
            }
        });
    });
    console.log("...OK");

    console.log("Sending to database");
    const data: FileContents = parsed;
    const u = new User(),
        a = new Artist(),
        s = new Song(),
        f = new Favorites();
    // ------------------------------------- Loop through each user
    for (const entry of data) {
        const { user, songs } = entry;
        console.log(`Importing > ${user}`);
        const createdUser = await u.findOrCreate(user);
        // --------------------------------- Loop through each of their favorite songs
        for (const song of songs) {
            const [artistName, songTitle] = song.song.split("-");
            console.log(`Importing song > ${song.song.trim()}`);
            const createdArtist = await a.findOrCreate(artistName.trim());
            const createdSong = await s.findOrCreate(
                createdArtist.id,
                songTitle.trim()
            );

            console.log(
                `Importing favorite > ${createdUser.name} -> ${createdSong.song_title}`
            );

            await f.TEMP_IMPORT_ERROR_OVERRIDE(
                createdUser.id,
                createdSong.id,
                new Date(song.date * 1000)
            );
        }
    }
    console.log("...OK");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

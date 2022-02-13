import { PrismaClient } from "@prisma/client";
import { __redisClient, CacheNames, getRedisClient } from "../../utils/redis";
import { Artist } from "./Artist";
import { Song } from "./Song";

export class Playlist {
    private db: PrismaClient;
    private cache: typeof __redisClient;

    constructor() {
        this.db = new PrismaClient();
        this.cache = getRedisClient();
    }

    public async setNowPlaying(songWithArtist: string) {
        const a = new Artist();
        const s = new Song();

        // For anyone reading this, including future me
        //
        // I opted to have this be the "ingest" station
        // if you will, as the following conditions
        // need to be met:
        // - SeasideFM does not need to pre-add a song
        // - SeasideFM does not need to pre-add artists
        // - SeasideFM does not manually set playing songs
        // - The "file read" script we have MUST
        //   be able to read a file and log a song
        //
        // The only way I can accomplish all of this
        // is by upserting everything here
        //===============================================

        const [artistName, songTitle] = songWithArtist
            .split("-")
            .map((s) => s.trim());

        const artist = await a.findOrCreate(artistName);

        const createdSong = await s.findOrCreate(artist.id, songTitle);

        console.log("-> Setting current playlist to not playing");
        await this.db.playlistEntry.updateMany({
            where: {
                playing: true,
            },
            data: {
                playing: false,
            },
        });

        console.log("-> Clearing cached playlist entry");
        await this.cache.json.del(CacheNames.NowPlaying);

        console.log("-> Creating playlist entry");
        return await this.db.playlistEntry.create({
            data: {
                played_on: new Date(),
                song_id: createdSong.id,
                playing: true,
            },
        });
    }

    public async nowPlaying() {
        const cached = await this.cache.json.get(CacheNames.NowPlaying);

        if (cached) {
            return cached;
        }

        const newValue = await this.db.playlistEntry.findFirst({
            where: {
                playing: true,
            },
            select: {
                id: true,
                song: {
                    select: {
                        song_title: true,
                        artists: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        await this.cache.json.set(CacheNames.NowPlaying, ".", newValue);

        return newValue;
    }
}

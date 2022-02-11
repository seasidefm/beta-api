import {PrismaClient, Song as PrismaSong} from "@prisma/client";
import {IServiceBase} from "./interface";

export class Song implements IServiceBase<PrismaSong>{
    private db: PrismaClient
    constructor() {
        this.db = new PrismaClient()
    }

    public async findOrCreate(artistId: number, song: string) {
        return await this.db.song.upsert({
            where: {
                song_title_artist_id: {
                    artist_id: artistId,
                    song_title: song
                }
            },
            update: {},
            create: {
                song_title: song,
                artists: {
                    connect: {
                        id: artistId
                    },
                },
            }
        })
    }
}
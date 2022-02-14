import {PrismaClient, Artist as PrismaArtist} from "@prisma/client";
import {IServiceBase} from "./interface";

export class Artist implements IServiceBase<PrismaArtist>{
    private db: PrismaClient
    constructor() {
        this.db = new PrismaClient()
    }

    public async findOrCreate(artistName: string) {
        return await this.db.artist.upsert({
            where: {
                name: artistName.toLowerCase().trim()
            },
            update: {},

            // If one is not found, findOrCreate an artist with that name
            create: {
                name: artistName,
            }
        })
    }
}
import { PrismaClient, Request as PrismaRequest } from "@prisma/client";
import { IServiceBase } from "./interface";

export interface RequestMetaInput {
    ripped?: boolean;
    streamed?: boolean;
    ownedStatus?: boolean;
    notes?: string;
}

export class Request implements IServiceBase<PrismaRequest> {
    private db: PrismaClient;
    constructor() {
        this.db = new PrismaClient();
    }

    public async findOrCreate(
        user: number,
        artistWithSong: string,
        dates?: {
            requested?: Date;
            played?: Date;
        },
        meta?: RequestMetaInput
    ) {
        const [artist, song] = artistWithSong
            .split("-")
            .map((item) => item.trim());
        return await this.db.request.create({
            data: {
                artist,
                song,
                dateRequested: dates?.requested,
                datePlayed: dates?.played,
                userData: {
                    connect: {
                        id: user,
                    },
                },
                meta: {
                    create: {
                        ...(meta ? meta : {}),
                    },
                },
            },
        });
    }
}

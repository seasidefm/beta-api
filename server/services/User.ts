import {PrismaClient, User as PrismaUser} from "@prisma/client";
import {IServiceBase} from "./interface";

export class User implements IServiceBase<PrismaUser>{
    private db: PrismaClient
    constructor() {
        this.db = new PrismaClient()
    }

    public async findOrCreate(userName: string) {
        return await this.db.user.upsert({
            where: {
                name: userName.toLowerCase().trim()
            },
            update: {},

            // If one is not found, findOrCreate an artist with that name
            create: {
                name: userName,
            }
        })
    }
}
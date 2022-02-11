import {PrismaClient} from "@prisma/client";

export class Favorite {
    private db: PrismaClient
    constructor() {
        this.db = new PrismaClient()
    }

    public async create(user: number, song: number, date?: Date) {
        try {
            return await this.db.favorite.create({
                data: {
                    song,
                    user,
                    dateSaved: date
                }
            })
        } catch (e) {
            console.error(song)
        }
    }
}
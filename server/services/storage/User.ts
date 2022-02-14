import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { Entropy, charset64 } from "entropy-string";

import { IServiceBase } from "./interface";

export interface CredentialsPayload {
    access_token: string;
    refresh_token: string;
    scope: string[];
    token_type: "bearer";
}

export class User implements IServiceBase<PrismaUser> {
    private db: PrismaClient;
    private tokenGenerator: Entropy;

    constructor() {
        this.db = new PrismaClient();
        this.tokenGenerator = new Entropy({ charset: charset64 });
    }

    public async findOrCreate(userName: string) {
        return await this.db.user.upsert({
            where: {
                name: userName.toLowerCase().trim(),
            },
            update: {},

            // If one is not found, findOrCreate an artist with that name
            create: {
                name: userName,
            },
        });
    }

    public async storeTwitchCredentials(
        user: PrismaUser["id"],
        credentials: CredentialsPayload
    ) {
        return await this.db.twitchCredentials.create({
            data: {
                user,
                platform_token: this.tokenGenerator.token(),
                ...credentials,
                scope: credentials.scope.join(","),
            },
        });
    }
}

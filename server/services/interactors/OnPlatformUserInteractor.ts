import { PrismaClient } from "@prisma/client";

export type FindOrCreateOnPlatformUserInput = string;

export class OnPlatformUserInteractor {
    private readonly onPlatformUserModel: PrismaClient["user"];

    constructor() {
        const client = new PrismaClient();
        this.onPlatformUserModel = client.user;
    }

    // This is a purposely loose method
    // ========================================
    public async findOrCreateOnPlatformUser(
        user: FindOrCreateOnPlatformUserInput
    ) {
        return await this.onPlatformUserModel.upsert({
            where: {
                name: user,
            },
            update: {},
            create: {
                name: user,
            },
        });
    }
}

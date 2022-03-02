import { PrismaClient, TwitchUserProfile } from "@prisma/client";

export type TwitchProfileInput = TwitchUserProfile;

export class TwitchProfileInteractor {
    private twitchProfileModel: PrismaClient["twitchUserProfile"];

    constructor() {
        const client = new PrismaClient();
        this.twitchProfileModel = client.twitchUserProfile;
    }

    public async createTwitchProfile(profileData: TwitchProfileInput) {
        this.twitchProfileModel.create({
            data: {
                ...profileData,
            },
        });
    }

    public async readTwitchProfile(profile: TwitchUserProfile["twitch_id"]) {
        return await this.twitchProfileModel.findUnique({
            where: {
                twitch_id: profile,
            },
        });
    }
}

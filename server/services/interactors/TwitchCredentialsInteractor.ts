import { PrismaClient } from "@prisma/client";
import { CredentialsPayload } from "../storage/User";
import { charset64, Entropy } from "entropy-string";

export class TwitchCredentialsInteractor {
    private readonly twitchCredentialsModel: PrismaClient["twitchCredentials"];
    private readonly tokenGenerator: Entropy;

    constructor() {
        const client = new PrismaClient();
        this.twitchCredentialsModel = client.twitchCredentials;
        this.tokenGenerator = new Entropy({ charset: charset64 });
    }

    public async createTokenForCredentials(
        user: number,
        twitch_id: string,
        credentials: CredentialsPayload
    ) {
        return await this.twitchCredentialsModel.create({
            data: {
                twitch_id,
                user_id: user,
                platform_token: this.tokenGenerator.token(),
                ...credentials,
                scope: credentials.scope.join(","),
            },
        });
    }

    public async findCredentialsByToken(
        token: string,
        returnUserData: boolean = false
    ) {
        return await this.twitchCredentialsModel.findUnique({
            where: {
                platform_token: token,
            },
            select: {
                OnPlatformUser: returnUserData,
                TwitchUserProfile: returnUserData,
            },
        });
    }
}

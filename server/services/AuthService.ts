import { CredentialsPayload, User } from "./storage/User";
import { TwitchService } from "./TwitchService";

export interface UserObject {}

export class AuthService {
    private userTable: User;
    private twitch: TwitchService;

    constructor() {
        this.userTable = new User();
        this.twitch = new TwitchService();
    }

    public async loginUser(
        username: string,
        twitchCredentials: CredentialsPayload
    ) {
        const usernamePayload = await this.twitch.getTwitchTokenInfo(
            twitchCredentials.access_token
        );
        const data = await this.twitch.getTwitchUserDetails(
            usernamePayload.preferred_username,
            twitchCredentials.access_token
        );

        if (!data.data || data.error) {
            throw new Error(data.error || "Cannot fetch twitch details");
        }

        const { user, twitchProfile } =
            await this.userTable.findOrLinkTwitchProfile(username, {
                twitch: data.data[0],
            });

        const tokenPayload = await this.userTable.storeTwitchCredentials(
            user.id,
            twitchProfile.twitch_id,
            twitchCredentials
        );

        return tokenPayload.platform_token;
    }

    public async getUserInfo(token: string) {
        return this.userTable.findByToken(token);
    }
}

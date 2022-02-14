import { CredentialsPayload, User } from "./storage/User";
import { TwitchService } from "./TwitchService";

export class AuthService {
    private userTable: User;
    private twitch: TwitchService;

    constructor() {
        this.userTable = new User();
        this.twitch = new TwitchService();
    }

    public async checkToken(token: string) {}

    public async loginUser(
        user: string,
        twitchCredentials: CredentialsPayload
    ) {
        const usernamePayload = await this.twitch.getTwitchUsername(
            twitchCredentials.access_token
        );
        const data = await this.twitch.getTwitchUserInfo(
            usernamePayload.preferred_username,
            twitchCredentials.access_token
        );
        console.log(data);

        const userData = await this.userTable.findOrCreate(user);
        const tokenPayload = await this.userTable.storeTwitchCredentials(
            userData.id,
            twitchCredentials
        );

        return tokenPayload.platform_token;
    }
}

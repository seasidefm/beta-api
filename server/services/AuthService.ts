import { CredentialsPayload, User } from "./storage/User";

export class AuthService {
    private userTable: User;
    constructor() {
        this.userTable = new User();
    }

    public async loginUser(
        user: string,
        twitchCredentials: CredentialsPayload
    ) {
        const userData = await this.userTable.findOrCreate(user);
        const tokenPayload = await this.userTable.storeTwitchCredentials(
            userData.id,
            twitchCredentials
        );

        return tokenPayload.platform_token;
    }
}

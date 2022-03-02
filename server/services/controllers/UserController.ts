import { OnPlatformUserInteractor } from "../interactors/OnPlatformUserInteractor";
import {
    TwitchProfileInput,
    TwitchProfileInteractor,
} from "../interactors/TwitchProfileInteractor";
import { TwitchCredentialsInteractor } from "../interactors/TwitchCredentialsInteractor";

export type UserControllerTwitchProfile = Omit<
    TwitchProfileInput,
    "twitch_id" | "user"
> & {
    id: string;
};

export class UserController {
    private onPlatformUserInteractor: OnPlatformUserInteractor;
    private twitchProfileInteractor: TwitchProfileInteractor;
    private twitchCredentialsInteractor: TwitchCredentialsInteractor;

    constructor() {
        this.onPlatformUserInteractor = new OnPlatformUserInteractor();
        this.twitchProfileInteractor = new TwitchProfileInteractor();
        this.twitchCredentialsInteractor = new TwitchCredentialsInteractor();
    }

    public async findOrCreateOnPlatformUser(username: string) {
        return this.onPlatformUserInteractor.findOrCreateOnPlatformUser(
            username
        );
    }

    public async createNewTwitchProfileForUser(
        username: string,
        profile: UserControllerTwitchProfile
    ) {
        const user = await this.findOrCreateOnPlatformUser(username);

        const twitch_id = profile.id;
        // @ts-ignore
        delete profile.id;

        const profileInput: TwitchProfileInput = {
            ...profile,
            twitch_id,
            user: user.id,
        };

        return await this.twitchProfileInteractor.createTwitchProfile(
            profileInput
        );
    }
}

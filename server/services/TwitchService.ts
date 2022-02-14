import fetch from "isomorphic-unfetch";

export interface TwitchUserInfoResponse {
    aud: string;
    exp: number;
    iat: 1641498027;
    iss: string;
    sub: string;
    azp: string;
    preferred_username: string;
}

export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string; // ISO Date?
}

export interface TwitchUserResponse {
    data: TwitchUser[];
    error?: string;
}

export class TwitchService {
    private clientId: string;
    constructor() {
        const clientId = process.env.TWITCH_CLIENT_ID;
        if (!clientId) {
            throw new Error("Cannot find TWITCH_CLIENT_ID in env");
        }

        this.clientId = clientId;
    }

    public async getTwitchUsername(token: string) {
        return await fetch("https://id.twitch.tv/oauth2/userinfo", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json() as Promise<TwitchUserInfoResponse>);
    }

    public async getTwitchUserInfo(
        username: string,
        token: string
    ): Promise<{ data: TwitchUser[]; error?: string }> {
        return await fetch(
            `https://api.twitch.tv/helix/users?login=${username}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Client-Id": this.clientId,
                },
            }
        ).then((res) => res.json() as Promise<TwitchUserResponse>);
    }
}

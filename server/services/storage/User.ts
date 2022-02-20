import {
    PrismaClient,
    TwitchUserProfile as PrismaTwitchProfile,
    User as PrismaUser,
} from "@prisma/client";
import { charset64, Entropy } from "entropy-string";

import { IServiceBase } from "./interface";
import { __redisClient, getRedisClient } from "../../utils/redis";
import { TwitchUser } from "../TwitchService";

export interface CredentialsPayload {
    access_token: string;
    refresh_token: string;
    scope: string[];
    token_type: "bearer";
}

export interface ExternalProfile {
    twitch?: TwitchUser;
}

export class User implements IServiceBase<PrismaUser> {
    private db: PrismaClient;
    private cache: typeof __redisClient;
    private tokenGenerator: Entropy;

    constructor() {
        this.db = new PrismaClient();
        this.cache = getRedisClient();
        this.tokenGenerator = new Entropy({ charset: charset64 });
    }

    // This should primarily be used for bots and automatic logging
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

    private async __createTwitchProfile(
        onPlatformUser: number,
        profile: TwitchUser
    ) {
        const twitch_id = profile.id;
        // @ts-ignore
        delete profile.id;

        return await this.db.twitchUserProfile.upsert({
            where: {
                twitch_id,
            },
            update: {},
            create: {
                ...profile,
                twitch_id,
                user: onPlatformUser,
            },
        });
    }

    public async findByToken(token: string) {
        return await this.db.twitchCredentials.findUnique({
            where: {
                platform_token: token,
            },
            select: {
                OnPlatformUser: true,
                TwitchUserProfile: true,
            },
        });
    }

    public async findOrLinkTwitchProfile(
        user: string,
        profile: ExternalProfile
    ): Promise<{
        user: PrismaUser;
        twitchProfile: PrismaTwitchProfile;
    }> {
        if (!profile.twitch) {
            throw new Error("Cannot find twitch user profile!");
        }

        // NOTE: Checking before updating is the ONLY way to make sure
        // that we do not create a "new" user when a user has simply
        // changed their username off-platform
        const preExistingUserData = await this.db.user.findUnique({
            where: {
                name: user,
            },
        });

        const preExistingTwitchProfile =
            await this.db.twitchUserProfile.findUnique({
                where: {
                    twitch_id: profile.twitch?.id,
                },
            });

        if (preExistingTwitchProfile && preExistingUserData) {
            console.log("Found twitch profile and matching user profile");
            return {
                user: preExistingUserData,
                twitchProfile: preExistingTwitchProfile,
            };
        }

        // The user has changed their username, update the user profile
        // to match
        if (!preExistingUserData && preExistingTwitchProfile) {
            console.log(
                `Found twitch profile ${preExistingTwitchProfile.display_name}, but no matching user profile`
            );
            const profile = await this.db.user.update({
                where: {
                    id: preExistingTwitchProfile.user,
                },
                data: {
                    name: user,
                },
            });

            return {
                user: profile,
                twitchProfile: preExistingTwitchProfile,
            };
        }

        // This is a first time login for an active chat member
        if (!preExistingTwitchProfile && preExistingUserData) {
            console.log(
                `Found user profile ${preExistingUserData.name}, but no matching twitch profile`
            );
            return {
                user: preExistingUserData,
                twitchProfile: await this.__createTwitchProfile(
                    preExistingUserData.id,
                    profile.twitch
                ),
            };
        }

        // Default condition is create BOTH internal and external
        // user profiles. This condition is only met when a user
        // has NOT used a creative command in chat, and is logging
        // in here FIRST.

        console.log(`No matching twitch or user profile found for ${user}`);

        const userData = await this.db.user.upsert({
            where: {
                name: user,
            },
            update: {},
            create: {
                name: user,
            },
        });

        const twitchProfile = await this.__createTwitchProfile(
            userData.id,
            profile.twitch
        );

        return {
            twitchProfile,
            user: userData,
        };
    }

    public async storeTwitchCredentials(
        user: number,
        twitch_id: string,
        credentials: CredentialsPayload
    ) {
        return await this.db.twitchCredentials.create({
            data: {
                twitch_id,
                user_id: user,
                platform_token: this.tokenGenerator.token(),
                ...credentials,
                scope: credentials.scope.join(","),
            },
        });
    }
}

import { createClient } from "redis";

export enum CacheNames {
    TwitchData = "twitch-user-data",
    UserFavoriteCounts = "user-fave-counts",
    FavoritesLeaderboard = "favorites-leaderboard",
    NowPlaying = "now-playing",
}

export const __redisClient = createClient();

export const setupRedisClient = async () => {
    __redisClient.on("error", (err) => console.log("Redis Client Error", err));
    __redisClient.on("connect", () => console.log("Connected to Redis cache"));
    await __redisClient.connect();

    console.log("Clearing up cache objects from last deploy...");
    for (const key of Object.keys(CacheNames)) {
        const cache = CacheNames[key as keyof typeof CacheNames];
        await __redisClient.del(cache);
        await __redisClient.json.del(cache, ".");
    }

    console.log("Done");
};

export const getRedisClient = () => __redisClient;

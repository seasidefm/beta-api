import { createClient } from 'redis';

export enum CacheNames {
    FavoritesLeaderboard = "favorites-leaderboard",
    NowPlaying = "now-playing",
}

const client = createClient();

export const setupRedisClient = async () => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('Connected to Redis cache'));
    await client.connect();

    console.log('Clearing up cache objects from last deploy...')
    for (const key of Object.keys(CacheNames)) {
        const cache = CacheNames[key as keyof typeof CacheNames]
        await client.del(cache)
        await client.json.del(cache, ".")
    }

    console.log('Done')
}

export const getRedisClient = () => client
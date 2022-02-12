import {
    PrismaClient,
    Favorite as PrismaFavorite,
    Song as PrismaSong,
} from "@prisma/client";
import { __redisClient, CacheNames, getRedisClient } from "../../utils/redis";

export interface UserWithFavorites {
    name: string;
    favorites: Array<{
        dateSaved: Date;
        songData: PrismaSong;
    }>;
}

export interface UserWithFavoriteCount {
    _count: { favorites: number };
    name: string;
}

export interface IFavoriteService {
    create(user: number, song: number, date?: Date): Promise<PrismaFavorite>;
    getUserFavorites(
        user: string | number
    ): Promise<UserWithFavorites["favorites"]>;
    getAllUsersFavorites(): Promise<Array<UserWithFavorites>>;
    getAllFavoriteCounts(
        orderBy: "asc" | "desc"
    ): Promise<Array<UserWithFavoriteCount>>;
}

export class Favorites implements IFavoriteService {
    private db: PrismaClient;
    private cache: typeof __redisClient;

    constructor() {
        this.db = new PrismaClient();
        this.cache = getRedisClient();
    }

    public async create(user: number, song: number, date?: Date) {
        return await this.db.favorite.create({
            data: {
                song,
                user,
                dateSaved: date,
            },
        });
        // try {
        //
        // } catch (e) {
        //     console.error(song)
        // }
    }

    public async getUserFavorites(userIdentifier: string | number) {
        return await this.db.favorite.findMany({
            where: {
                userData:
                    typeof userIdentifier === "string"
                        ? {
                              name: userIdentifier,
                          }
                        : {
                              id: userIdentifier,
                          },
            },
            select: {
                dateSaved: true,
                songData: true,
            },
        });
    }

    public async getAllUsersFavorites() {
        return await this.db.user.findMany({
            select: {
                name: true,
                favorites: {
                    select: {
                        dateSaved: true,
                        songData: true,
                    },
                },
            },
        });
    }

    public async getAllFavoriteCounts(
        orderBy: "asc" | "desc"
    ): Promise<Array<UserWithFavoriteCount>> {
        // If there is an exising cached value, use it
        const existingCache = await this.cache.json.get(
            CacheNames.UserFavoriteCounts
        );

        if (existingCache) {
            // type cast because redis JSON typing is opaque
            return existingCache as unknown as Array<UserWithFavoriteCount>;
        }

        // Otherwise, re-fetch from scratch
        const newValue = await this.db.user.findMany({
            orderBy: {
                favorites: {
                    _count: orderBy,
                },
            },
            select: {
                name: true,
                _count: {
                    select: {
                        favorites: true,
                    },
                },
            },
        });

        // Set the cache with the new value for next time
        await this.cache.json.set(CacheNames.UserFavoriteCounts, ".", newValue);

        return newValue;
    }
}

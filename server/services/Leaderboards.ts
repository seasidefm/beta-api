import {
    Favorites,
    IFavoriteService,
    UserWithFavoriteCount,
} from "./storage/Favorites";
import { __redisClient, getRedisClient } from "../utils/redis";

interface ILeaderboard {
    getFavoritesLeaderboard(
        sort: "asc" | "desc"
    ): Promise<Array<UserWithFavoriteCount>>;
}

export class Leaderboards implements ILeaderboard {
    private faves: IFavoriteService;
    private cache: typeof __redisClient;

    constructor() {
        this.faves = new Favorites();
        this.cache = getRedisClient();
    }

    async getFavoritesLeaderboard(
        sort: "asc" | "desc"
    ): Promise<Array<UserWithFavoriteCount>> {
        return await this.faves.getAllFavoriteCounts(sort);
    }
}

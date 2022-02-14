import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import { setupRedisClient } from "./utils/redis";
import { Leaderboards } from "./services/Leaderboards";
import { PlaylistManager } from "./services/PlaylistManager";
import authRoutes from "./routes/auth";

const prisma = new PrismaClient();

const app = express();

app.use(
    cors({
        origin: (requestOrigin, callback) => {
            const isAllowedOrigin =
                requestOrigin?.endsWith("seaside.fm") ||
                requestOrigin?.includes("localhost") ||
                typeof requestOrigin === "undefined";
            if (isAllowedOrigin) {
                return callback(null, true);
            }

            return callback(new Error(`Host ${requestOrigin} not allowed!`));
        },
    })
);
app.use(express.json());

app.get("/health", (_, res) => {
    res.send("Healthy!");
});

// Authentication
// ========================================
app.use("/auth", authRoutes);

// Now-playing and playlist endpoints
// ========================================
const playlistManager = new PlaylistManager();

app.get("/now-playing", async (_, res) => {
    res.json({
        data: await playlistManager.getNowPlaying(),
    });
});

app.put("/now-playing", async (req, res) => {
    const { song: songWithArtist }: { song?: string } = req.body;

    if (!songWithArtist) {
        return res.status(400).json({
            error: "Please make sure body is valid JSON with a 'song' key",
        });
    }

    return res.json({
        data: await playlistManager.addSongToPlaylist(songWithArtist),
    });
});

app.get("/favorites", async (_, res) => {
    const usersWithFavorites = await prisma.user.findMany({
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

    res.json({ data: usersWithFavorites });
});

// Leaderboards Endpoint(s)
// ================================================
const leaderboards = new Leaderboards();

app.get("/leaderboard/favorites", async (req, res) => {
    const leaderboard = await leaderboards.getFavoritesLeaderboard("desc");
    res.json({
        data: leaderboard,
    });
});

console.log("Starting Seaside-API");
const port = Number(process.env.PORT) || 5000;
app.listen(port, "0.0.0.0", async () => {
    console.log(`Seaside-API listening on ${port}`);
    await setupRedisClient();
});

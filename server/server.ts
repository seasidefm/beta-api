import express from 'express'

import { PrismaClient } from '@prisma/client'
import {CacheNames, getRedisClient, setupRedisClient} from "./utils/redis";
import {Artist} from "./services/Artist";
import {Song} from "./services/Song";
const prisma = new PrismaClient()

const app = express()

app.use(express.json())

app.get('/health', (_, res) => {
    res.send('Healthy!')
})

app.get('/now-playing', async (_, res) => {
    console.log('GET [/now-playing] - {')
    const redis = getRedisClient()

    const cached = await redis.json.get(CacheNames.NowPlaying)

    if (cached) {
        console.log('-> Found cached version of now-playing')
        res.json({data: cached})
        console.log('}')
        return
    }

    console.log('-> No cached now-playing song, reading from db')
    const playing = await prisma.playlistEntry.findFirst({
        where: {
            playing: true
        }
    })

    res.send({
        data: playing
    })
    console.log('}')
})

app.put('/now-playing', async (req, res) => {
    console.log('PUT [/now-playing] - {')
    const redis = getRedisClient()
    const a = new Artist()
    const s = new Song()

    const {song}: {song: string} = req.body
    if (!song) {
        return res.status(400).json({ error: "Cannot find `song` in request body!" })
    }

    // For anyone reading this, including future me
    //
    // I opted to have this be the "ingest" station
    // if you will, as the following conditions
    // need to be met:
    // - SeasideFM does not need to pre-add a song
    // - SeasideFM does not need to pre-add artists
    // - SeasideFM does not manually set playing songs
    // - The "file read" script we have MUST
    //   be able to read a file and log a song
    //
    // The only way I can accomplish all of this
    // is by upserting everything here
    //===============================================

    const [artistName, songTitle] = song.split('-').map(s => s.trim())

    console.log('-> Upserting given artist')
    const artist = await a.findOrCreate(artistName)

    console.log('-> Upserting given song')
    const createdSong = await s.findOrCreate(artist.id, songTitle)

    console.log('-> Setting current playlist to not playing')
    await prisma.playlistEntry.updateMany({
        where: {
            playing: true
        },
        data: {
            playing: false
        }
    })

    console.log('-> Creating playlist entry')
    const entry = await prisma.playlistEntry.create({
        data: {
            played_on: new Date(),
            song_id: createdSong.id,
            playing: true
        },
    })

    console.log('-> Caching result...')
    await redis.json.set(CacheNames.NowPlaying, '.', entry)

    res.json({
        data: entry
    })
    console.log('}')
})

app.get('/favorites', async (_, res) => {
    const usersWithFavorites = await prisma.user.findMany({
        select: {
            name: true,
            favorites: {
                select: {
                    dateSaved: true,
                    songData: true,
                }
            }
        }
    })

    res.json({ data: usersWithFavorites })
})

app.get('/leaderboard/favorites', async (_, res) => {
    console.log('[/leaderboard/favorites] - {')
    const redis = getRedisClient()
    //
    // await redis.json.del(CacheNames.FavoritesLeaderboard)

    const cached = await redis.json.get(CacheNames.FavoritesLeaderboard)

    // Short circuit if the cache is populated
    // - cache will be cleared on inserting a new favorite
    //   or other related actions
    // ====================================================
    if (cached) {
        console.log('-> Cached value found for favorites leaderboard')
        res.json({
            data: cached
        })
        console.log('}')
        return
    }
    console.log('-> No cached value for favorites leaderboard!')

    // No cache is present, use the database instead
    // - cache will be set after this call
    // ====================================================
    const usersWithFavorites = await prisma.user.findMany({
        orderBy: {
            favorites: {
                _count: "asc"
            }
        },
        select: {
            name: true,
            _count: {
                select: {
                    favorites: true
                }
            }
        }
    })


    // Create the data structure we want to cache, then
    await redis.json.set(CacheNames.FavoritesLeaderboard, '.', usersWithFavorites)

    res.json({
        data: usersWithFavorites
    })
    console.log('}')
})

console.log('Starting Seaside-API')
const port = Number(process.env.PORT) || 5000
app.listen(port, '0.0.0.0', async () => {
    console.log(`Seaside-API listening on ${port}`)
    await setupRedisClient()
})


import express from 'express'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express()

app.get('/health', (_, res) => {
    res.send('Healthy!')
})

app.get('/favorites',async (_, res) => {
    const usersWithFavorites = await prisma.user.findMany({
        select: {
            name: true,
            favorites: {
                select: {
                    songData: true,
                    userData: true
                }
            }
        }
    })

    res.json({ data: usersWithFavorites })
})

console.log('Starting Seaside-API')
const port = Number(process.env.PORT) || 5000
app.listen(port, '0.0.0.0', () => {
    console.log(`Seaside-API listening on ${port}`)
})


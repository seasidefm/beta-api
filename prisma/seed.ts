import { PrismaClient } from "@prisma/client";

// DO NOT USE THIS SEEDER SCRIPT FOR PRODUCTION

async function main() {
    const prisma = new PrismaClient();
    console.log("Seeding Experience Levels");
    await prisma.experienceLevel.createMany({
        data: [
            { level: 0, name: "Seaside Parking", required_exp: 0 },
            // { level: 1, name: "Mignonne", required_exp: 100 },
            { level: 1, name: "Ride on seaside", required_exp: 100 },
            // { level: 2, name: "Sugar Babe", required_exp: 250 },
            { level: 2, name: "Oceanside", required_exp: 250 },
            // { level: 3, name: "After 5", required_exp: 500 },
            { level: 3, name: "Monster Stomp", required_exp: 500 },
            { level: 4, name: "Monochrome", required_exp: 1000 },
            // { level: 5, name: "Monster Stomp", required_exp: 1500 },
            { level: 5, name: "Adventure", required_exp: 1500 },
            // { level: 6, name: "Adventure", required_exp: 2500 },
            { level: 6, name: "After 5 Clash", required_exp: 2500 },
            { level: 7, name: "Sugar Babe", required_exp: 3750 },
            // { level: 7, name: "Oceanside", required_exp: 3750 },
            { level: 8, name: "Ride on Time", required_exp: 5000 },
            { level: 9, name: "Kimi wa 1000%", required_exp: 6500 },
            { level: 10, name: "Magical", required_exp: 8000 },
        ],
    });
    console.log('...OK')

    console.log('Seeding Development Users')
    await prisma.user.createMany({
        data: [
            {
                name: 'duke_ferdinand'
            },
            {
                name: 'seasidefm'
            },
            {
                name: 'back2monke'
            }
        ]
    })
    console.log('...OK')

    console.log('Seeding User Levels')
    const users = await prisma.user.findMany({})
    for (const user of users) {
        await prisma.userExperience.create({
            data: {
                userId: user.id,
                total_experience: 0,
                level: 0
            }
        })
    }
    console.log('...OK')
}

main().then(() => console.log('Done'))

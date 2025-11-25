import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient({
    datasources: {
        db: process.env.DATABASE_URL,
    },
});

async function main() {
    const password = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { phone: "09150000000" },
        update: {},
        create: {
            name: 'super',
            family: 'admin',
            phone: "09150000000",
            password,
            role: 'ADMIN'
        }
    })
}

main()
    .catch((e) => console.log(e))
    .then(() => prisma.$disconnect())
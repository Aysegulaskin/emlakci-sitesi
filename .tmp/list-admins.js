require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL || '') });

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, createdAt: true } });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

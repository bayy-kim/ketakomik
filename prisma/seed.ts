import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_HnZv9DNXjhz1@ep-super-bonus-az1l2789-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating admin user credentials in Neon PostgreSQL...");

  const adminEmail = "muhamadaibayu@gmail.com";
  const adminPassword = await bcrypt.hash("bayy muhamad", 10);

  // 1. Update user with email muhamadaibayu@gmail.com
  const updatedUser = await prisma.user.updateMany({
    where: { email: adminEmail },
    data: {
      passwordHash: adminPassword,
      role: "ADMIN",
      tinta: 500,
    },
  });
  console.log("Updated user by email:", updatedUser.count);

  // 2. Update user with username admin
  const updatedAdmin = await prisma.user.updateMany({
    where: { username: "admin" },
    data: {
      passwordHash: adminPassword,
      role: "ADMIN",
      tinta: 500,
    },
  });
  console.log("Updated user by username admin:", updatedAdmin.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

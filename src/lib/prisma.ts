import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_HnZv9DNXjhz1@ep-super-bonus-az1l2789-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (e) {
    console.warn("PrismaClient initialization warning:", e);
    return new Proxy({} as PrismaClient, {
      get() {
        return () => Promise.resolve(null);
      },
    });
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && db) {
  globalForPrisma.prisma = db;
}

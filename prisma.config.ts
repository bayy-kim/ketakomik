import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HnZv9DNXjhz1@ep-super-bonus-az1l2789-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});

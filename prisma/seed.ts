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
  console.log("Seeding database Tekakonik ke Neon PostgreSQL...");

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@tekakomik.app",
      passwordHash: adminPassword,
      role: "ADMIN",
      tinta: 500,
      currentStreak: 10,
      longestStreak: 15,
    },
  });
  console.log("Admin user created/updated:", admin.username);

  // 2. Create Chapter 1
  const chapter1 = await prisma.chapter.create({
    data: {
      title: "Chapter 1: Jejak Pertama Bayangan",
      chapterNote: "Kapten Klu menemukan coretan misterius di dinding kota. Apakah Bayangan sengaja meninggalkan petunjuk ini?",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
      weekStartDate: new Date(),
      isPublished: true,
    },
  });
  console.log("Chapter 1 created:", chapter1.title);

  // 3. Create Sample Words for Today and Upcoming Days
  const today = new Date();
  const wordsData = [
    {
      text: "KOMIK",
      normalizedText: "KOMIK",
      difficulty: "EASY" as const,
      clueHonest: "Buku bergambar yang menceritakan sebuah kisah lewat panel-panel cerita.",
      clueMisleading: "Koleksi gambar kue mangkok kesukaan superhero saat sarapan pagi.",
      category: "Literasi",
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      chapterId: chapter1.id,
    },
    {
      text: "DETEKTIF",
      normalizedText: "DETEKTIF",
      difficulty: "MEDIUM" as const,
      clueHonest: "Seseorang yang bertugas menyelidiki kejahatan dan mengumpulkan bukti rahasia.",
      clueMisleading: "Tukang kebun yang khusus memotong rumput berbentuk karakter komik favorit.",
      category: "Profesi",
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      chapterId: chapter1.id,
    },
    {
      text: "BAYANGAN",
      normalizedText: "BAYANGAN",
      difficulty: "HARD" as const,
      clueHonest: "Kegelapan buatan yang tercipta ketika cahaya terhalang oleh suatu benda.",
      clueMisleading: "Kucing hitam misterius yang suka mencuri es krim di tengah malam.",
      category: "Misteri",
      scheduledDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      chapterId: chapter1.id,
    },
  ];

  for (const w of wordsData) {
    await prisma.word.upsert({
      where: { scheduledDate: w.scheduledDate },
      update: {},
      create: w,
    });
  }
  console.log("Words seeded successfully!");

  // 4. Create Initial Feature Flags
  const flags = [
    { key: "duel_mode", isEnabled: true },
    { key: "hardcore_mode", isEnabled: true },
    { key: "maintenance_mode", isEnabled: false },
  ];

  for (const f of flags) {
    await prisma.featureFlag.upsert({
      where: { key: f.key },
      update: { isEnabled: f.isEnabled },
      create: f,
    });
  }
  console.log("Feature flags created!");

  // 5. Create Announcement Banner
  await prisma.announcement.create({
    data: {
      message: "🎉 Selamat Datang di Tekakonik! Tebak Kata Harian Bergaya Komik Modern & Kalahkan Trik Bayangan!",
      isActive: true,
      startAt: new Date(),
    },
  });
  console.log("Announcement banner created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

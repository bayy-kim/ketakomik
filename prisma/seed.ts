import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding and clearing Tekakomik database...");

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "muhamadaibayu@gmail.com";
  const rawPassword = process.env.ADMIN_SEED_PASSWORD || "bayy muhamad";
  const adminPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Clear testing/dummy data sessions, duels, reset tokens, claims
  try {
    await prisma.gameSession.deleteMany({});
    await prisma.duelChallenge.deleteMany({});
    await prisma.wordSuggestion.deleteMany({});
    await prisma.userAchievement.deleteMany({});
    await prisma.passwordResetToken.deleteMany({});
    await prisma.announcement.deleteMany({});
    console.log("Cleared game sessions, duel challenges, suggestions, achievements, tokens, and announcements.");
  } catch (e) {
    console.log("Error clearing tables:", e);
  }

  // 2. Clear non-admin users
  try {
    await prisma.user.deleteMany({
      where: {
        NOT: {
          email: adminEmail,
        },
      },
    });
    console.log("Cleared non-admin users.");
  } catch (e) {
    console.log("Error clearing users:", e);
  }

  // 3. Verify Admin User
  const userByEmail = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (userByEmail) {
    await prisma.user.update({
      where: { id: userByEmail.id },
      data: {
        passwordHash: adminPassword,
        role: "ADMIN",
        tinta: 500,
      },
    });
  } else {
    const userByUsername = await prisma.user.findFirst({
      where: { username: "admin" },
    });

    if (userByUsername) {
      await prisma.user.update({
        where: { id: userByUsername.id },
        data: {
          email: adminEmail,
          passwordHash: adminPassword,
          role: "ADMIN",
          tinta: 500,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          username: "admin",
          email: adminEmail,
          passwordHash: adminPassword,
          role: "ADMIN",
          tinta: 500,
        },
      });
    }
  }
  console.log("Admin credentials verified.");

  // 4. Reset & Seed 5 Chapters & 5 Words per Chapter
  try {
    await prisma.word.deleteMany({});
    await prisma.chapter.deleteMany({});
    console.log("Existing words and chapters cleared for fresh seeding.");
  } catch (e) {
    console.log("Error cleaning words/chapters:", e);
  }

  const baseDate = new Date();

  // Chapter 1
  const ch1 = await prisma.chapter.create({
    data: {
      title: "Chapter 1: Jejak Misterius di Balik Dinding",
      chapterNote: "Kapten Klu menemukan coretan misterius berbentuk simbol aneh di dinding kota tua. Bayangan meninggalkan tanda pertamanya.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
      weekStartDate: new Date(baseDate.getTime() - 86400000 * 21), // 3 weeks ago
      isPublished: true,
    },
  });

  const ch1Words = [
    { text: "KOMIK", difficulty: "EASY", clueHonest: "Buku bergambar yang menceritakan sebuah kisah lewat panel-panel gambar.", clueMisleading: "Jenis camilan renyah yang dimakan Kapten Klu saat begadang mencari petunjuk.", category: "Literasi" },
    { text: "KLU", difficulty: "EASY", clueHonest: "Petunjuk atau isyarat yang membantu memecahkan sebuah misteri.", clueMisleading: "Nama pulau rahasia tempat Bayangan menyembunyikan tinta komiknya.", category: "Misteri" },
    { text: "TINTA", difficulty: "EASY", clueHonest: "Cairan hitam atau berwarna yang digunakan untuk menulis dan menggambar komik.", clueMisleading: "Minuman energi favorit Bayangan sebelum melakukan aksi jailnya.", category: "Peralatan" },
    { text: "DINDING", difficulty: "MEDIUM", clueHonest: "Struktur vertikal kokoh yang membatasi dan melindungi suatu area kota.", clueMisleading: "Kertas lipat rahasia tempat detektif menulis daftar tersangka utama.", category: "Lokasi" },
    { text: "JEJAK", difficulty: "EASY", clueHonest: "Bekas atau tanda yang ditinggalkan oleh seseorang atau sesuatu saat bergerak.", clueMisleading: "Jenis topi detektif yang dipakai Kapten Klu agar tidak kepanasan.", category: "Petunjuk" },
  ];

  // Chapter 2
  const ch2 = await prisma.chapter.create({
    data: {
      title: "Chapter 2: Surat Kaleng Berbau Mawar",
      chapterNote: "Sebuah surat kaleng mendarat di meja Kapten Klu dengan aroma bunga mawar. Bayangan menantangnya melakukan duel kecerdasan.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      weekStartDate: new Date(baseDate.getTime() - 86400000 * 14), // 2 weeks ago
      isPublished: true,
    },
  });

  const ch2Words = [
    { text: "MAWAR", difficulty: "EASY", clueHonest: "Bunga berduri yang memiliki aroma wangi, sering dikaitkan dengan cinta atau rahasia.", clueMisleading: "Jenis sayuran hijau yang ditanam Bayangan untuk menjebak Kapten Klu.", category: "Tanaman" },
    { text: "SURAT", difficulty: "EASY", clueHonest: "Kertas bertuliskan pesan tertutup yang dikirim dari satu orang ke orang lain.", clueMisleading: "Senjata lempar tajam berbentuk kartu yang sering dipakai detektif bertarung.", category: "Komunikasi" },
    { text: "SANDI", difficulty: "MEDIUM", clueHonest: "Kode rahasia atau kumpulan simbol untuk menyembunyikan arti pesan yang sebenarnya.", clueMisleading: "Nama panggilan paman Kapten Klu yang bekerja sebagai pustakawan kota.", category: "Misteri" },
    { text: "AROMA", difficulty: "MEDIUM", clueHonest: "Bau wangi atau wewangian yang dapat dideteksi oleh indra penciuman manusia.", clueMisleading: "Nama ramuan ajaib untuk membuat Bayangan bisa menghilang di siang hari.", category: "Sensori" },
    { text: "MAFIA", difficulty: "HARD", clueHonest: "Kelompok kriminal rahasia terorganisir yang beroperasi di bawah bayang-bayang.", clueMisleading: "Kelompok penggemar komik yang suka mengumpulkan tanda tangan Kapten Klu.", category: "Organisasi" },
  ];

  // Chapter 3
  const ch3 = await prisma.chapter.create({
    data: {
      title: "Chapter 3: Pencurian di Museum Kota",
      chapterNote: "Mahkota emas peninggalan sejarah hilang dari etalase museum. Kapten Klu mendeteksi keterlibatan agen-agen Bayangan.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      weekStartDate: new Date(baseDate.getTime() - 86400000 * 7), // 1 week ago
      isPublished: true,
    },
  });

  const ch3Words = [
    { text: "MUSEUM", difficulty: "MEDIUM", clueHonest: "Gedung tempat penyimpanan dan pameran benda-benda bersejarah yang berharga.", clueMisleading: "Nama kafe tempat Kapten Klu dan Bayangan sering minum teh bersama.", category: "Lokasi" },
    { text: "EMAS", difficulty: "EASY", clueHonest: "Logam mulia berwarna kuning berkilau yang bernilai sangat tinggi secara universal.", clueMisleading: "Bahan pembuat jubah Kapten Klu agar bisa memantulkan laser jebakan.", category: "Barang" },
    { text: "MAHKOTA", difficulty: "MEDIUM", clueHonest: "Hiasan kepala simbol kekuasaan tertinggi yang dikenakan oleh raja atau ratu.", clueMisleading: "Alat komunikasi rahasia berbentuk bando melingkar di kepala detektif.", category: "Barang" },
    { text: "PENJAGA", difficulty: "MEDIUM", clueHonest: "Orang yang bertugas mengawasi dan mengamankan suatu area agar tetap aman.", clueMisleading: "Asisten robot milik Bayangan yang suka membuat coretan di dinding.", category: "Profesi" },
    { text: "ALARM", difficulty: "EASY", clueHonest: "Alat peringatan dini berupa bunyi keras ketika mendeteksi bahaya atau penyusupan.", clueMisleading: "Nama hewan peliharaan Bayangan yang bisa berbunyi seperti terompet.", category: "Peralatan" },
  ];

  // Chapter 4
  const ch4 = await prisma.chapter.create({
    data: {
      title: "Chapter 4: Teka-Teki Labirin Cermin",
      chapterNote: "Kapten Klu terjebak di taman hiburan tua yang diubah Bayangan menjadi labirin cermin penuh ilusi optik.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
      weekStartDate: new Date(baseDate.getTime()), // Today
      isPublished: true,
    },
  });

  const ch4Words = [
    { text: "CERMIN", difficulty: "EASY", clueHonest: "Kaca bening berlapis perak yang memantulkan bayangan benda di depannya secara sempurna.", clueMisleading: "Alat untuk menembus dimensi lain yang dibuat oleh laboratorium rahasia.", category: "Peralatan" },
    { text: "LABIRIN", difficulty: "MEDIUM", clueHonest: "Sistem jalur rumit berliku-liku dengan banyak jalan buntu yang membingungkan.", clueMisleading: "Jenis permainan papan catur gaya baru kesukaan para penjahat super.", category: "Misteri" },
    { text: "ILUSI", difficulty: "MEDIUM", clueHonest: "Pengamatan palsu atau tipuan pandangan yang tidak sesuai dengan kenyataan.", clueMisleading: "Nama panggung Bayangan saat dia menyamar menjadi pesulap jalanan.", category: "Psikologi" },
    { text: "PANTUL", difficulty: "MEDIUM", clueHonest: "Gerakan membalikkan kembali cahaya, bunyi, atau benda setelah menumbuk bidang.", clueMisleading: "Gaya bertarung Kapten Klu menggunakan sepatu pegas andalannya.", category: "Fisika" },
    { text: "KACA", difficulty: "EASY", clueHonest: "Materi keras transparan yang biasanya mudah pecah, digunakan untuk jendela.", clueMisleading: "Makanan penutup manis kesukaan Bayangan yang berbentuk permata berkilau.", category: "Material" },
  ];

  // Chapter 5
  const ch5 = await prisma.chapter.create({
    data: {
      title: "Chapter 5: Konfrontasi di Menara Jam",
      chapterNote: "Detik-detik akhir penangkapan! Kapten Klu berhadapan langsung dengan Bayangan di puncak Menara Jam Kota.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
      weekStartDate: new Date(baseDate.getTime() + 86400000 * 7), // 1 week in future
      isPublished: true,
    },
  });

  const ch5Words = [
    { text: "MENARA", difficulty: "MEDIUM", clueHonest: "Bangunan tinggi menjulang ke atas, sering digunakan untuk pengawasan atau pemancar.", clueMisleading: "Alat pengaduk tinta rahasia raksasa milik dinas kebersihan kota.", category: "Bangunan" },
    { text: "JAM", difficulty: "EASY", clueHonest: "Alat penunjuk waktu yang memiliki jarum penunjuk detik, menit, dan jam.", clueMisleading: "Senjata pelumpuh detektif berbentuk cakram berputar yang sangat lambat.", category: "Peralatan" },
    { text: "WAKTU", difficulty: "EASY", clueHonest: "Seluruh rangkaian saat ketika proses, perbuatan, atau keadaan berada atau berlangsung.", clueMisleading: "Nama jus buah ajaib yang bisa mempercepat lari Kapten Klu.", category: "Dimensi" },
    { text: "PUNCAK", difficulty: "EASY", clueHonest: "Bagian yang paling tinggi atau bagian teratas dari suatu structure atau gunung.", clueMisleading: "Nama samaran lain dari Bayangan saat berada di puncak karier kriminalnya.", category: "Lokasi" },
    { text: "MENANG", difficulty: "EASY", clueHonest: "Keadaan berhasil mengalahkan lawan atau sukses memecahkan seluruh teka-teki.", clueMisleading: "Jenis tali tambang baja untuk menahan jam menara agar tidak jatuh.", category: "Status" },
  ];

  let wordIndex = 0;
  const allChapters = [
    { ch: ch1, words: ch1Words },
    { ch: ch2, words: ch2Words },
    { ch: ch3, words: ch3Words },
    { ch: ch4, words: ch4Words },
    { ch: ch5, words: ch5Words },
  ];

  for (const item of allChapters) {
    for (const w of item.words) {
      const scheduledDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 15 + wordIndex);

      await prisma.word.create({
        data: {
          text: w.text,
          normalizedText: w.text,
          difficulty: w.difficulty as "EASY" | "MEDIUM" | "HARD",
          clueHonest: w.clueHonest,
          clueMisleading: w.clueMisleading,
          category: w.category,
          scheduledDate,
          chapterId: item.ch.id,
        },
      });
      wordIndex++;
    }
  }

  console.log(`Successfully seeded ${wordIndex} words across 5 story chapters!`);

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
  console.log("Feature flags verified.");

  await prisma.announcement.create({
    data: {
      message: "🎉 Selamat Datang di Tekakomik! Selesaikan Chapter Cerita Detektif & Dapatkan Hadiah Tinta Komik!",
      isActive: true,
      startAt: new Date(),
    },
  });
  console.log("Announcement banner verified.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

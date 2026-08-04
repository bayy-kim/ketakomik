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
  console.log("Seeding 21 Chapters & 105 General Knowledge Words into Tekakomik database...");

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "muhamadaibayu@gmail.com";
  const rawPassword = process.env.ADMIN_SEED_PASSWORD || "bayy muhamad";
  const adminPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Clear testing/dummy data
  try {
    await prisma.gameSession.deleteMany({});
    await prisma.duelChallenge.deleteMany({});
    await prisma.wordSuggestion.deleteMany({});
    await prisma.userAchievement.deleteMany({});
    await prisma.passwordResetToken.deleteMany({});
    await prisma.announcement.deleteMany({});
    console.log("Cleared old sessions, duels, tokens, and achievements.");
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

  // 4. Clear words & chapters for fresh seed
  try {
    await prisma.word.deleteMany({});
    await prisma.chapter.deleteMany({});
    console.log("Existing words and chapters cleared for clean seeding.");
  } catch (e) {
    console.log("Error cleaning words/chapters:", e);
  }

  const baseDate = new Date();

  // DEFINISI 21 CHAPTER BERSAMA 105 SOAL PENGETAHUAN UMUM INDONESIA & DUNIA
  const chaptersData = [
    {
      title: "Chapter 1: Jejak Misterius di Balik Dinding",
      chapterNote: "Kapten Klu menemukan coretan misterius berbentuk simbol aneh di dinding kota tua. Bayangan meninggalkan tanda pertamanya.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "KOMIK", difficulty: "EASY", clueHonest: "Buku bergambar yang menceritakan kisah lewat urutan panel.", clueMisleading: "Jenis camilan renyah kesukaan detektif saat sarapan.", category: "Literasi" },
        { text: "KLU", difficulty: "EASY", clueHonest: "Petunjuk atau isyarat yang membantu memecahkan misteri.", clueMisleading: "Nama pulau rahasia tempat Bayangan bertapa.", category: "Misteri" },
        { text: "TINTA", difficulty: "EASY", clueHonest: "Cairan hitam atau berwarna untuk menulis dan menggambar komik.", clueMisleading: "Minuman rahasia pembuat Bayangan bisa menghilang.", category: "Peralatan" },
        { text: "DINDING", difficulty: "MEDIUM", clueHonest: "Struktur vertikal kokoh yang membatasi dan melindungi area kota.", clueMisleading: "Kertas lipat rahasia tempat detektif menulis daftar tersangka.", category: "Lokasi" },
        { text: "JEJAK", difficulty: "EASY", clueHonest: "Tanda yang ditinggalkan oleh seseorang saat melangkah.", clueMisleading: "Jenis topi superhero Kapten Klu agar tidak kepanasan.", category: "Petunjuk" },
      ],
    },
    {
      title: "Chapter 2: Surat Kaleng Berbau Mawar",
      chapterNote: "Sebuah surat kaleng mendarat di meja Kapten Klu dengan aroma mawar. Bayangan menantangnya melakukan duel kecerdasan.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "MAWAR", difficulty: "EASY", clueHonest: "Bunga berduri aromatis yang menjadi simbol cinta dan rahasia.", clueMisleading: "Sayuran hijau yang ditanam Bayangan di kebun komiknya.", category: "Tanaman" },
        { text: "SURAT", difficulty: "EASY", clueHonest: "Pesan tertulis dalam amplop untuk berkomunikasi jarak jauh.", clueMisleading: "Senjata lempar berbentuk kartu remi milik detektif.", category: "Komunikasi" },
        { text: "SANDI", difficulty: "MEDIUM", clueHonest: "Kode rahasia atau enkripsi untuk menyembunyikan arti pesan.", clueMisleading: "Nama paman Kapten Klu yang bekerja sebagai pustakawan.", category: "Misteri" },
        { text: "AROMA", difficulty: "MEDIUM", clueHonest: "Wewangian yang tercium oleh indra penciuman manusia.", clueMisleading: "Jurus sihir Bayangan saat membuat ramuan kabut.", category: "Sensori" },
        { text: "MAFIA", difficulty: "HARD", clueHonest: "Organisasi kejahatan terencana yang bergerak di dunia hitam.", clueMisleading: "Klub penggemar komik terbesar di kota super.", category: "Organisasi" },
      ],
    },
    {
      title: "Chapter 3: Pencurian di Museum Kota",
      chapterNote: "Mahkota emas hilang dari etalase museum. Kapten Klu mendeteksi jejak infiltrasi agen Bayangan.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "MUSEUM", difficulty: "MEDIUM", clueHonest: "Gedung pameran benda-benda sejarah dan artefak kuno.", clueMisleading: "Warung kopi favorit Kapten Klu saat bertukar kabar.", category: "Lokasi" },
        { text: "EMAS", difficulty: "EASY", clueHonest: "Logam mulia kuning berkilau yang sangat berharga.", clueMisleading: "Bahan pembuat jubah perang pemantul sinai laser.", category: "Barang" },
        { text: "MAHKOTA", difficulty: "MEDIUM", clueHonest: "Hiasan kepala simbol kekuasaan tertinggi raja atau ratu.", clueMisleading: "Alat pengirim sinyal bando melingkar di kepala.", category: "Barang" },
        { text: "PENJAGA", difficulty: "MEDIUM", clueHonest: "Petugas yang bertugas mengawasi dan mengamankan lokasi.", clueMisleading: "Robot kecil ciptaan Bayangan yang suka menggambar.", category: "Profesi" },
        { text: "ALARM", difficulty: "EASY", clueHonest: "Sirine peringatan dini saat mendeteksi bahaya atau penyusupan.", clueMisleading: "Suara nyaring burung beo peliharaan Bayangan.", category: "Peralatan" },
      ],
    },
    {
      title: "Chapter 4: Teka-Teki Labirin Cermin",
      chapterNote: "Kapten Klu terjebak di taman hiburan tua yang diubah Bayangan menjadi labirin cermin Penuh ilusi.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "CERMIN", difficulty: "EASY", clueHonest: "Kaca bening berlapis yang memantulkan bayangan secara utuh.", clueMisleading: "Pintu portal dimensi buatan laboratorium sains rahasia.", category: "Peralatan" },
        { text: "LABIRIN", difficulty: "MEDIUM", clueHonest: "Jaringan jalan rumit berliku dengan banyak lorong buntu.", clueMisleading: "Jenis permainan catur komik raksasa di ruang rahasia.", category: "Misteri" },
        { text: "ILUSI", difficulty: "MEDIUM", clueHonest: "Tipuan pandangan mata yang membuat sesuatu tampak berbeda.", clueMisleading: "Nama panggung pesulap jahat lawan Kapten Klu.", category: "Psikologi" },
        { text: "PANTUL", difficulty: "MEDIUM", clueHonest: "Gerakan membalikkan kembali gelombang atau benda yang menumbuk.", clueMisleading: "Jurus melompat tinggi sepatu pegas milik detektif.", category: "Fisika" },
        { text: "KACA", difficulty: "EASY", clueHonest: "Bahan keras transparan yang umumnya digunakan pada jendela.", clueMisleading: "Permen bening favorit Bayangan yang rasanya manis.", category: "Material" },
      ],
    },
    {
      title: "Chapter 5: Konfrontasi di Menara Jam",
      chapterNote: "Kapten Klu berhadapan langsung dengan Bayangan di puncak Menara Jam Kota saat tengah malam.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "MENARA", difficulty: "MEDIUM", clueHonest: "Bangunan tinggi menjulang yang berfungsi sebagai pemancar atau pengawas.", clueMisleading: "Mesin pembuat tinta komik raksasa di pusat kota.", category: "Bangunan" },
        { text: "JAM", difficulty: "EASY", clueHonest: "Alat penunjuk waktu berjarum atau berlayar digital.", clueMisleading: "Senjata piringan berputar yang membuat detektif mengantuk.", category: "Peralatan" },
        { text: "WAKTU", difficulty: "EASY", clueHonest: "Rangkaian detik, menit, dan jam saat peristiwa terjadi.", clueMisleading: "Nama jus ajaib penambah kecepatan berlari Kapten Klu.", category: "Dimensi" },
        { text: "PUNCAK", difficulty: "EASY", clueHonest: "Bagian tertinggi atau ujung atas suatu bangunan/gunung.", clueMisleading: "Nama gelar kehormatan Bayangan di dunia komik.", category: "Lokasi" },
        { text: "MENANG", difficulty: "EASY", clueHonest: "Kondisi berhasil mengalahkan lawan atau memecahkan soal.", clueMisleading: "Jenis simpul tali baja penahan roda gigi menara jam.", category: "Status" },
      ],
    },
    {
      title: "Chapter 6: Monumen Megah Nusantara",
      chapterNote: "Penyelidikan berlanjut ke Jakarta. Tugu ikonik dengan lidah api berlapis emas menjadi saksi bisu rahasia sejarah.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "MONAS", difficulty: "EASY", clueHonest: "Monumen Nasional setinggi 132 meter di Lapangan Medan Merdeka.", clueMisleading: "Stasiun kereta api cepat tempat Kapten Klu mengejar musuh.", category: "Geografi" },
        { text: "GARUDA", difficulty: "EASY", clueHonest: "Burung mitologi agung yang menjadi Lambang Negara Indonesia.", clueMisleading: "Pesawat tempur canggih ciptaan laboratorium Bayangan.", category: "Sejarah" },
        { text: "ISTANA", difficulty: "MEDIUM", clueHonest: "Kediaman resmi kepala negara atau tempat pemerintahan berkantor.", clueMisleading: "Rumah pohon tempat Kapten Klu menyimpan koleksi komiknya.", category: "Bangunan" },
        { text: "BENDERA", difficulty: "EASY", clueHonest: "Kain Merah Putih simbol kedaulatan dan kebanggaan bangsa.", clueMisleading: "Kain lap piring yang dipakai Bayangan untuk menyamar.", category: "Simbol" },
        { text: "SEJARAH", difficulty: "MEDIUM", clueHonest: "Catatan kejadian nyata di masa lalu yang dipelajari manusia.", clueMisleading: "Buku fiksi ramalan cuaca buatan detektif magang.", category: "Literasi" },
      ],
    },
    {
      title: "Chapter 7: Keajaiban Candi Borobudur",
      chapterNote: "Di Magelang, Kapten Klu menjelajahi kemegahan stupa batu dari abad ke-8 peninggalan Dinasti Syailendra.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "BOROBUDUR", difficulty: "MEDIUM", clueHonest: "Candi Buddha terbesar di dunia yang terletak di Jawa Tengah.", clueMisleading: "Nama benteng rahasia tempat Bayangan meracik bumbu dapur.", category: "Sejarah" },
        { text: "CANDI", difficulty: "EASY", clueHonest: "Bangunan batu kuno tempat pemujaan dan peninggalan purbakala.", clueMisleading: "Menara pengawas radar cuaca berteknologi tinggi.", category: "Arsitektur" },
        { text: "STUPA", difficulty: "MEDIUM", clueHonest: "Bangunan berbentuk mangkuk terbalik atau lonceng pada candi.", clueMisleading: "Alat pengeras suara raksasa untuk mengumumkan event komik.", category: "Arsitektur" },
        { text: "RELIEF", difficulty: "HARD", clueHonest: "Seni pahatan ukiran batu yang menonjol pada dinding candi.", clueMisleading: "Nama obat sakit kepala favorit para superhero komik.", category: "Kesenian" },
        { text: "PATUNG", difficulty: "EASY", clueHonest: "Karya seni tiga dimensi yang dipahat menyerupai manusia/hewan.", clueMisleading: "Manekin pajangan di toko jubah superhero Kapten Klu.", category: "Kesenian" },
      ],
    },
    {
      title: "Chapter 8: Pesona Danau Toba",
      chapterNote: "Menjelajahi danau vulkanik terbesar di Asia Tenggara yang terbentuk dari letusan dahsyat gunung super purba.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "TOBA", difficulty: "EASY", clueHonest: "Danau vulkanik raksasa dengan Pulau Samosir di tengahnya.", clueMisleading: "Nama jurus tendangan pamungkas Kapten Klu saat bertarung.", category: "Geografi" },
        { text: "DANAU", difficulty: "EASY", clueHonest: "Genangan air luas yang dikelilingi oleh daratan di sekitarnya.", clueMisleading: "Kolam renang buatan di markas rahasia Bayangan.", category: "Geografi" },
        { text: "VULKANIK", difficulty: "HARD", clueHonest: "Proses atau bentukan yang berkaitan dengan aktivitas gunung berapi.", clueMisleading: "Bahan peledak pembuat kembang api warna-warni komik.", category: "Sains" },
        { text: "PULAU", difficulty: "EASY", clueHonest: "Daratan yang seluruh sisinya dikelilingi oleh perairan.", clueMisleading: "Nama piring kayu tempat menyajikan makanan tradisional.", category: "Geografi" },
        { text: "SAMOSIR", difficulty: "MEDIUM", clueHonest: "Pulau yang terletak persis di tengah-tengah Danau Toba.", clueMisleading: "Nama koki pribadi Bayangan yang suka memasak mi instan.", category: "Geografi" },
      ],
    },
    {
      title: "Chapter 9: Surga Bahari Raja Ampat",
      chapterNote: "Menyelami gugusan pulau karang Papua yang menjadi pusat keanekaragaman hayati laut terkaya di planet Bumi.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "AMPAT", difficulty: "EASY", clueHonest: "Angka empat dalam sebutan nama gugusan kepulauan eksotis Papua.", clueMisleading: "Jumlah kaki robot pengawas milik agen rahasia Bayangan.", category: "Geografi" },
        { text: "TERUMBU", difficulty: "MEDIUM", clueHonest: "Struktur batu kapur di laut yang dihasilkan oleh organisme koral.", clueMisleading: "Benteng pertahanan pasir pantai buatan Kapten Klu.", category: "Kelautan" },
        { text: "KARANG", difficulty: "EASY", clueHonest: "Hewan laut kecil yang membentuk koloni batuan di dasar laut.", clueMisleading: "Batu akik jimat ajaib penambah daya ingat detektif.", category: "Kelautan" },
        { text: "LAUT", difficulty: "EASY", clueHonest: "Kumpulan air asin luas yang menghubungkan antar benua dan pulau.", clueMisleading: "Nama minuman es kelapa muda rasa nangka segar.", category: "Geografi" },
        { text: "SELAM", difficulty: "EASY", clueHonest: "Aktivitas menyelam ke dalam air menggunakan peralatan tabung oksigen.", clueMisleading: "Gaya melompat detektif dari helikopter tanpa parasut.", category: "Olahraga" },
      ],
    },
    {
      title: "Chapter 10: Warisan Budaya Batik",
      chapterNote: "Menyelidiki teknik menorehkan malam di atas kain mori menggunakan canting. Karya seni lukis asli Nusantara.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "BATIK", difficulty: "EASY", clueHonest: "Kain bergambar bergaya khas buatan Indonesia dengan perintang malam.", clueMisleading: "Merk pensil gambar favorit yang dipakai ilustrator komik.", category: "Budaya" },
        { text: "CANTING", difficulty: "MEDIUM", clueHonest: "Alat kecil berpencurut untuk menorehkan cairan malam pada kain.", clueMisleading: "Gelas kunir asem favorit Kapten Klu saat bersantai.", category: "Peralatan" },
        { text: "KAIN", difficulty: "EASY", clueHonest: "Bahan tekstil tenunan yang digunakan untuk pakaian dan seni.", clueMisleading: "Kertas pembungkus kado berisi petunjuk rahasia Bayangan.", category: "Material" },
        { text: "MOTIF", difficulty: "EASY", clueHonest: "Polam corak hiasan atau bentuk berulang pada karya seni batik.", clueMisleading: "Alasan rahasia kenapa Bayangan selalu memakai kacamata hitam.", category: "Kesenian" },
        { text: "NATIVE", difficulty: "MEDIUM", clueHonest: "Istilah bahasa inggris untuk warisan atau warga asli setempat.", clueMisleading: "Nama aplikasi pembuat efek suara ledakan dalam komik.", category: "Istilah" },
      ],
    },
    {
      title: "Chapter 11: Seni Pertunjukan Wayang",
      chapterNote: "Layar kelir terbentang. Dalang menggerakkan tokoh kulit menceritakan wiracarita Ramayana dan Mahabharata.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "WAYANG", difficulty: "EASY", clueHonest: "Seni pertunjukan boneka kulit atau kayu asli budaya Nusantara.", clueMisleading: "Topeng plastik mainan yang dipakai Bayangan saat menyamar.", category: "Budaya" },
        { text: "DALANG", difficulty: "MEDIUM", clueHonest: "Sutradara sekaligus narator yang memainkan wayang di belakang layar.", clueMisleading: "Orang di balik layar yang mengatur pasokan tinta di kota.", category: "Profesi" },
        { text: "KELIR", difficulty: "HARD", clueHonest: "Layar kain putih tempat bayangan wayang dipantulkan saat pentas.", clueMisleading: "Warna krayon khusus milik detektif untuk menggambar peta.", category: "Peralatan" },
        { text: "GAMELAN", difficulty: "MEDIUM", clueHonest: "Ensemble musik tradisional Jawa yang didominasi instrumen gong dan saron.", clueMisleading: "Nama grup musik rock kesukaan superhero Kapten Klu.", category: "Musik" },
        { text: "LAKON", difficulty: "MEDIUM", clueHonest: "Alur cerita atau peran tokoh yang dibawakan dalam pertunjukan.", clueMisleading: "Jenis sabun mandi khusus peningkat fokus kerja detektif.", category: "Kesenian" },
      ],
    },
    {
      title: "Chapter 12: Harmoni Alat Musik Angklung",
      chapterNote: "Alunan bilah bambu yang digoyangkan tercipta nada merdu. Alat musik bambu asal Jawa Barat warisan UNESCO.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "ANGKLUNG", difficulty: "MEDIUM", clueHonest: "Alat musik bernada ganda dari pipa bambu yang dibunyikan digoyangkan.", clueMisleading: "Tongkat pemukul kriket buatan tangan kesukaan Bayangan.", category: "Musik" },
        { text: "BAMBU", difficulty: "EASY", clueHonest: "Tanaman rumput berkayu berongga yang tumbuh cepat di wilayah tropis.", clueMisleading: "Sedotan minuman boba yang digunakan detektif saat santai.", category: "Tanaman" },
        { text: "NADA", difficulty: "EASY", clueHonest: "Tinggi rendahnya bunyi dalam seni musik atau lagu.", clueMisleading: "Sinyal bunyi rahasia jika ada musuh mendekat ke markas.", category: "Musik" },
        { text: "MELODI", difficulty: "EASY", clueHonest: "Susunan urutan nada yang terdengar indah dan berirama.", clueMisleading: "Nama kucing kesayangan Kapten Klu yang pandai melompat.", category: "Musik" },
        { text: "MUSIK", difficulty: "EASY", clueHonest: "Seni mengolah suara dan irama sehingga enak didengar oleh telinga.", clueMisleading: "Istilah suara bising saat petir menyambar di malam hari.", category: "Kesenian" },
      ],
    },
    {
      title: "Chapter 13: Kuliner Khas Gado Gado",
      chapterNote: "Penyelidikan berlanjut ke pasar tradisional. Sayuran segar rebus disiram kuah kacang gurih khas Jakarta.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "GADO", difficulty: "EASY", clueHonest: "Nama makanan salad Indonesia berkuah bumbu kacang gurih manis.", clueMisleading: "Jenis hewan peliharaan ajaib yang bisa bernyanyi merdu.", category: "Kuliner" },
        { text: "KACANG", difficulty: "EASY", clueHonest: "Biji-bijian lezat bahan utama saus gurih pada hidangan gado-gado.", clueMisleading: "Umpan jebakan yang disebar Bayangan di lantai keramik.", category: "Bahan" },
        { text: "BUMBU", difficulty: "EASY", clueHonest: "Rempah-rempah pengolah rasa masakan agar beraroma lezat.", clueMisleading: "Bedak rahasia untuk membuat detektif tampak lebih tampan.", category: "Kuliner" },
        { text: "SAYUR", difficulty: "EASY", clueHonest: "Bahan pangan bergizi dari bagian tanaman seperti bayam dan tauge.", clueMisleading: "Rumput hias yang ditanam di halaman markas superhero.", category: "Bahan" },
        { text: "KULINER", difficulty: "MEDIUM", clueHonest: "Segala hal yang berhubungan dengan seni dan olahan masakan makanan.", clueMisleading: "Daftar buku catatan harian perjalanan Kapten Klu.", category: "Gaya Hidup" },
      ],
    },
    {
      title: "Chapter 14: Kelezatan Rendang Nusantara",
      chapterNote: "Masakan daging olahan santan dan rempah khas Minangkabau yang pernah dinobatkan sebagai Makanan Terenak di Dunia.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "RENDANG", difficulty: "EASY", clueHonest: "Masakan daging pedas khas Sumatra Barat masak santan berjam-jam.", clueMisleading: "Nama jurus tendangan berputar Kapten Klu yang sangat kuat.", category: "Kuliner" },
        { text: "DAGING", difficulty: "EASY", clueHonest: "Bahan pangan protein utama olahan rendang pilihan masakan.", clueMisleading: "Bahan pembuat bantalan empuk di dalam markas detektif.", category: "Bahan" },
        { text: "SANTAN", difficulty: "EASY", clueHonest: "Cairan putih gurih dari perasan parutan kelapa murni.", clueMisleading: "Ramuan pemutih pakaian otomatis buatan laboratorium.", category: "Bahan" },
        { text: "REMPAH", difficulty: "MEDIUM", clueHonest: "Bagian tumbuhan beraroma kuat seperti cengkeh, kayu manis, dan kapulaga.", clueMisleading: "Remahan roti kering kesukaan Bayangan saat merancang rencana.", category: "Bahan" },
        { text: "PADANG", difficulty: "EASY", clueHonest: "Ibu kota Sumatra Barat yang terkenal dengan kelezatan rumah makannya.", clueMisleading: "Lapangan rumput terbuka tempat pendaratan helikopter.", category: "Geografi" },
      ],
    },
    {
      title: "Chapter 15: Satwa Langka Komodo",
      chapterNote: "Di Nusa Tenggara Timur, Kapten Klu mengamati kadal purba raksasa terpanjang di dunia yang dilindungi dunia.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "KOMODO", difficulty: "EASY", clueHonest: "Spesies kadal terbesar di dunia yang hidup di pulau komodo NTT.", clueMisleading: "Nama motor balap superhero buatan laboratorium Kapten Klu.", category: "Fauna" },
        { text: "NUSA", difficulty: "EASY", clueHonest: "Kata bahasa sansekerta yang berarti tanah air atau pulau-pulau.", clueMisleading: "Nama kapal selam mini tempat Bayangan menyembunyikan peta.", category: "Istilah" },
        { text: "KADAL", difficulty: "EASY", clueHonest: "Kelompok reptil bersisik berkaki empat yang berkerabat dengan komodo.", clueMisleading: "Jenis sepatu kulit yang tahan terhadap air dan lumpur.", category: "Fauna" },
        { text: "KANIBAL", difficulty: "HARD", clueHonest: "Sifat organisme yang memakan sesama jenis spesiesnya sendiri.", clueMisleading: "Nama permen rasa pedas manis kesukaan Bayangan saat lapar.", category: "Biologi" },
        { text: "TAMAN", difficulty: "EASY", clueHonest: "Kawasan pelestarian alam teradu untuk melindungi flora fauna langka.", clueMisleading: "Halaman bermain anak-anak di depan rumah Kapten Klu.", category: "Lokasi" },
      ],
    },
    {
      title: "Chapter 16: Habitat Anggun Anoa",
      chapterNote: "Menyusuri hutan hujan Sulawesi untuk menemukan kerbau kerdil endemik langka berpenampilan mirip rusa.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "ANOA", difficulty: "MEDIUM", clueHonest: "Kerbau kerdil mamalia langka khas Sulawesi yang dilindungi.", clueMisleading: "Nama kapal terbang rahasia yang dipakai detektif menyusur langit.", category: "Fauna" },
        { text: "SULAWESI", difficulty: "EASY", clueHonest: "Pulau besar di Indonesia berbentuk unik menyerupai huruf K.", clueMisleading: "Nama es krim buah naga kesukaan superhero Kapten Klu.", category: "Geografi" },
        { text: "MAMALIA", difficulty: "MEDIUM", clueHonest: "Kelompok hewan menyusui bernapas dengan paru-paru dan berdarah panas.", clueMisleading: "Jenis kacamata renang canggih pemindai jejak kaki.", category: "Biologi" },
        { text: "TANDUK", difficulty: "EASY", clueHonest: "Pertumbuhan tulang runcing di kepala hewan seperti anoa dan kerbau.", clueMisleading: "Hiasan antena helm komunikasi canggih milik detektif.", category: "Biologi" },
        { text: "HUTAN", difficulty: "EASY", clueHonest: "Kawasan luas berpohon rimbun yang menjadi habitat alami satwa liar.", clueMisleading: "Taman bunga kecil di belakang markas Kapten Klu.", category: "Lingkungan" },
      ],
    },
    {
      title: "Chapter 17: Satwa Perkasa Harimau",
      chapterNote: "Jejak cakar di batang pohon rimba Sumatra. Pemangsa puncak berbulu loreng oranye hitam yang sangat agung.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "HARIMAU", difficulty: "EASY", clueHonest: "Kucing besar pemangsa berbulu oranye bergaris loreng hitam.", clueMisleading: "Nama jubah siluman penghilang wujud buatan musuh.", category: "Fauna" },
        { text: "SUMATRA", difficulty: "EASY", clueHonest: "Pulau besar di barat Indonesia habitat harimau dan gajah.", clueMisleading: "Nama merk kopi kesukaan detektif saat meronda malam.", category: "Geografi" },
        { text: "LORENG", difficulty: "EASY", clueHonest: "Pola garis-garis beruntun pada bulu harimau atau pakaian militer.", clueMisleading: "Warna pita hadiah yang ditinggalkan Bayangan di meja.", category: "Pola" },
        { text: "RAKSASA", difficulty: "EASY", clueHonest: "Ukuran tubuh yang jauh lebih besar dari ukuran normal umumnya.", clueMisleading: "Nama boneka beruang raksasa di kamar tidur Kapten Klu.", category: "Ukuran" },
        { text: "RIMBA", difficulty: "MEDIUM", clueHonest: "Hutana lebat belantara yang masih alami dan jarang terjamah manusia.", clueMisleading: "Nama arena pertandingan bola komik terpopuler di kota.", category: "Lingkungan" },
      ],
    },
    {
      title: "Chapter 18: Pesona Bunga Rafflesia",
      chapterNote: "Bunga raksasa tanpa daun yang mengeluarkan aroma menyengat saat mekar sempurna di hutan Bengkulu.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "RAFFLESIA", difficulty: "HARD", clueHonest: "Bunga parasit raksasa terbesar tanpa batang atau daun asli Bengkulu.", clueMisleading: "Nama merek parfum mewah kesukaan Bayangan.", category: "Botani" },
        { text: "RAWA", difficulty: "EASY", clueHonest: "Lahan genangan air dangkal yang ditumbuhi berbagai tanaman air.", clueMisleading: "Kolam ikan hias di samping rumah Kapten Klu.", category: "Lingkungan" },
        { text: "MEKAR", difficulty: "EASY", clueHonest: "Proses mengembang indahnya mahkota bunga saat berkembang sempurna.", clueMisleading: "Suara balon pecah saat terkena jarum detektif.", category: "Botani" },
        { text: "AROMA", difficulty: "EASY", clueHonest: "Bau khas tajam menyengat yang dipancarkan oleh bunga tertentu.", clueMisleading: "Bumbu rahasia dapur komik penambah selera makan.", category: "Sensori" },
        { text: "BOTANI", difficulty: "HARD", clueHonest: "Cabang ilmu biologi yang mempelajari tumbuh-tumbuhan secara ilmiah.", clueMisleading: "Nama laboratorium pembuat komik bergambar superhero.", category: "Sains" },
      ],
    },
    {
      title: "Chapter 19: Keindahan Gunung Bromo",
      chapterNote: "Pesona kawah aktif dengan hamparan lautan pasir bisik yang memukau saat matahari terbit di Jawa Timur.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "BROMO", difficulty: "EASY", clueHonest: "Gunung berapi aktif terkenal di kawasan Taman Nasional Bromo Tengger.", clueMisleading: "Nama sepeda lipat pilihan Kapten Klu untuk patroli.", category: "Geografi" },
        { text: "KAWAH", difficulty: "MEDIUM", clueHonest: "Lubang besar berbentuk kawah hasil letusan berapi berisikan asap/belerang.", clueMisleading: "Mangkok sup panas tempat detektif makan siang.", category: "Geografi" },
        { text: "ERUPSI", difficulty: "HARD", clueHonest: "Fenomena letusan gunung berapi yang mengeluarkan material vulkanik.", clueMisleading: "Sorak kegirangan penonton saat Kapten Klu menang.", category: "Sains" },
        { text: "PASIR", difficulty: "EASY", clueHonest: "Butiran halus batuan yang membentang di lautan pasir Bromo.", clueMisleading: "Bumbu tabur manis pada kue donat rasa cokelat.", category: "Material" },
        { text: "SUNRISE", difficulty: "MEDIUM", clueHonest: "Momen fajar terbitnya matahari dari ufuk timur yang sangat indah.", clueMisleading: "Nama minuman es jeruk segar kesukaan detektif.", category: "Fenomena" },
      ],
    },
    {
      title: "Chapter 20: Kejayaan Kerajaan Majapahit",
      chapterNote: "Sumpah Palapa Patih Gajah Mada menggetarkan Nusantara di bawah panji kejayaan Kerajaan Majapahit.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "MAJAPAHIT", difficulty: "HARD", clueHonest: "Kerajaan bahari purba terbesar Nusantara berpusat di Jawa Timur.", clueMisleading: "Nama toko buku komik langka di pusat kota super.", category: "Sejarah" },
        { text: "SUMPAH", difficulty: "MEDIUM", clueHonest: "Janji suci teguh yang diucapkan untuk menyatukan wilayah Nusantara.", clueMisleading: "Mantra rahasia pemanggil helikopter bantuan Kapten Klu.", category: "Sejarah" },
        { text: "PALAPA", difficulty: "MEDIUM", clueHonest: "Nama sumpah ikrar terkenal yang diucapkan oleh Mahapatih Gajah Mada.", clueMisleading: "Nama jenis buah tropis asam manis kesukaan Bayangan.", category: "Sejarah" },
        { text: "HAYAM", difficulty: "MEDIUM", clueHonest: "Nama raja penguasa kejayaan Majapahit yang bergelar Hayam Wuruk.", clueMisleading: "Nama hewan unggas peliharaan detektif yang suka berkokok.", category: "Sejarah" },
        { text: "GAJAH", difficulty: "EASY", clueHonest: "Mamalia darat berbelalai raksasa sekaligus gelar patih pemberani.", clueMisleading: "Nama mainan tiup berbentuk hewan pembuat tertawa.", category: "Sejarah" },
      ],
    },
    {
      title: "Chapter 21: Ibu Kota Baru Nusantara",
      chapterNote: "Babak baru pembangunan ibu kota hijau berteknologi modern di Penajam Paser Utara, Kalimantan Timur.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      words: [
        { text: "IKN", difficulty: "EASY", clueHonest: "Singkatan dari Ibu Kota Nusantara yang baru dibangun pemerintah.", clueMisleading: "Singkatan dari Ikatan Komikus Nasional kota komik.", category: "Modern" },
        { text: "PENAJAM", difficulty: "HARD", clueHonest: "Kabupaten lokasi pembangunan kawasan inti pusat pemerintahan IKN.", clueMisleading: "Alat pengasah pensil gambar otomatis milik komikus.", category: "Geografi" },
        { text: "BORNEO", difficulty: "MEDIUM", clueHonest: "Nama internasional bagi Pulau Kalimantan yang kaya akan hutan.", clueMisleading: "Nama samaran kapten kapal bajak laut di buku komik.", category: "Geografi" },
        { text: "MODERN", difficulty: "EASY", clueHonest: "Konsep tata kota berteknologi masa kini yang ramah lingkungan.", clueMisleading: "Jenis tarian romantis yang sering ditonton Kapten Klu.", category: "Konsep" },
        { text: "SMARTHUB", difficulty: "HARD", clueHonest: "Pusat konektivitas cerdas berteknologi canggih bagi warga kota.", clueMisleading: "Nama kafe internet tempat Bayangan bermain game duel.", category: "Teknologi" },
      ],
    },
  ];

  let wordIndex = 0;

  for (let cIdx = 0; cIdx < chaptersData.length; cIdx++) {
    const chData = chaptersData[cIdx];
    const scheduledWeekDate = new Date(baseDate.getTime() - 86400000 * 7 * (20 - cIdx)); // Consecutive weekly start dates

    const createdChapter = await prisma.chapter.create({
      data: {
        title: chData.title,
        chapterNote: chData.chapterNote,
        unlockComicImageUrl: chData.unlockComicImageUrl,
        weekStartDate: scheduledWeekDate,
        isPublished: true,
      },
    });

    for (const w of chData.words) {
      const scheduledWordDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 105 + wordIndex);

      await prisma.word.create({
        data: {
          text: w.text,
          normalizedText: w.text,
          difficulty: w.difficulty as "EASY" | "MEDIUM" | "HARD",
          clueHonest: w.clueHonest,
          clueMisleading: w.clueMisleading,
          category: w.category,
          scheduledDate: scheduledWordDate,
          chapterId: createdChapter.id,
        },
      });
      wordIndex++;
    }
  }

  console.log(`Successfully seeded ${wordIndex} words across ${chaptersData.length} chapters!`);

  // Feature Flags
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

  // Announcement Banner
  await prisma.announcement.create({
    data: {
      message: "🎉 Selamat Datang di Tekakomik! Jelajahi 21 Chapter Pengetahuan Umum & Klaim +70 Tinta Harian!",
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

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
  // Clue Bayangan dirancang panjang (>1 paragraf) hampir memberi tahu jawaban tetapi dipelintir secara menyesatkan/lucu.
  const chaptersData = [
    {
      title: "Chapter 1: Jejak Misterius di Balik Dinding",
      chapterNote: "Kapten Klu menemukan coretan misterius berbentuk simbol aneh di dinding kota tua. Bayangan meninggalkan tanda pertamanya.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "KOMIK", 
          difficulty: "EASY", 
          clueHonest: "Buku bergambar yang menceritakan kisah lewat urutan panel.", 
          clueMisleading: "Oh, detektif cerdas! Kamu pasti mencari media bercerita bergambar yang diterbitkan berurutan dengan huruf K-O-M-I-K. \n\nTapi tunggu dulu! Bukankah itu sebenarnya resep kuno rahasia cara memanggang roti keju hangat bertabur wijen manis yang sering dimakan oleh Kapten Klu saat kebingungan malam hari? Jangan tertipu oleh panel gambar ilusi itu!",
          category: "Literasi" 
        },
        { 
          text: "KLU", 
          difficulty: "EASY", 
          clueHonest: "Petunjuk atau isyarat yang membantu memecahkan misteri.", 
          clueMisleading: "Apakah kamu butuh bantuan isyarat berupa tiga huruf sederhana K-L-U? \n\nJangan konyol! Sebenarnya itu adalah singkatan rahasia dari pulau terpencil berselimut salju abadi tempat dinosaurus menari cha-cha sambil memegang secangkir es teh manis hangat. Sungguh petunjuk yang luar biasa menyesatkan!",
          category: "Misteri" 
        },
        { 
          text: "TINTA", 
          difficulty: "EASY", 
          clueHonest: "Cairan hitam atau berwarna untuk menulis dan menggambar komik.", 
          clueMisleading: "Apakah benda cair berwarna gelap pekat untuk melukis dengan inisial T-I-N-T-A ini yang kamu cari? \n\nTentu saja salah besar! Itu sebenarnya merupakan ramuan sirup rasa blueberry mistis yang sengaja diminum Bayangan agar ia bisa berlari menembus dinding tebal tanpa terlacak kamera canggih CCTV detektif!",
          category: "Peralatan" 
        },
        { 
          text: "DINDING", 
          difficulty: "MEDIUM", 
          clueHonest: "Struktur vertikal kokoh yang membatasi dan melindungi area kota.", 
          clueMisleading: "Sebuah batas vertikal kokoh batu bata yang sering kamu sebut D-I-N-D-I-N-G. \n\nSangat keliru! Itu adalah tumpukan kertas koran bekas yang sengaja ditata rapi membentuk benteng pertahanan detektif magang agar terhindar dari siraman air hujan di malam minggu.",
          category: "Lokasi" 
        },
        { 
          text: "JEJAK", 
          difficulty: "EASY", 
          clueHonest: "Tanda yang ditinggalkan oleh seseorang saat melangkah.", 
          clueMisleading: "Sebuah tanda bekas telapak kaki J-E-J-A-K di lantai tanah. \n\nJangan percaya indramu! Itu hanyalah sisa tumpahan kecap manis berbentuk mirip kaki raksasa purba yang sengaja ditumpahkan oleh kucing peliharaan Bayangan untuk mempermainkan analisismu.",
          category: "Petunjuk" 
        },
      ],
    },
    {
      title: "Chapter 2: Surat Kaleng Berbau Mawar",
      chapterNote: "Sebuah surat kaleng mendarat di meja Kapten Klu dengan aroma mawar. Bayangan menantangnya melakukan duel kecerdasan.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "MAWAR", 
          difficulty: "EASY", 
          clueHonest: "Bunga berduri aromatis yang menjadi simbol cinta dan rahasia.", 
          clueMisleading: "Kamu pasti membayangkan sekuntum bunga merah berduri wangi M-A-W-A-R. \n\nPadahal itu adalah tanaman kubis ungu misterius yang diimpor dari planet Mars untuk dijadikan bahan baku jubah kamuflase Bayangan di tengah kebun bunga matahari.",
          category: "Tanaman" 
        },
        { 
          text: "SURAT", 
          difficulty: "EASY", 
          clueHonest: "Pesan tertulis dalam amplop untuk berkomunikasi jarak jauh.", 
          clueMisleading: "Sebuah dokumen kertas berisikan pesan rahasia S-U-R-A-T. \n\nJangan konyol, kertas itu sebenarnya adalah origami bangau terbang mainan yang sengaja ditulis dengan rumus matematika fisika kuno untuk meramal kapan hari kiamat komik akan tiba!",
          category: "Komunikasi" 
        },
        { 
          text: "SANDI", 
          difficulty: "MEDIUM", 
          clueHonest: "Kode rahasia atau enkripsi untuk menyembunyikan arti pesan.", 
          clueMisleading: "Sebuah deretan huruf sandi terenkripsi S-A-N-D-I. \n\nBukan main, itu sebenarnya nama penjual martabak manis keju kacang langganan Kapten Klu yang tinggal di ujung gang sempit gelap dekat kuburan tua kota.",
          category: "Misteri" 
        },
        { 
          text: "AROMA", 
          difficulty: "MEDIUM", 
          clueHonest: "Wewangian yang tercium oleh indra penciuman manusia.", 
          clueMisleading: "Sensasi bau harum semerbak bunga A-R-O-M-A. \n\nFaktanya, itu adalah gas kentut tak berbau dari kelinci percobaan laboratorium yang sedang memakan wortel berlapis cokelat manis buatan asisten Bayangan.",
          category: "Sensori" 
        },
        { 
          text: "MAFIA", 
          difficulty: "HARD", 
          clueHonest: "Organisasi kejahatan terencana yang bergerak di dunia hitam.", 
          clueMisleading: "Kelompok kartel kriminal hitam berkuasa M-A-F-I-A. \n\nPadahal mereka hanyalah sekumpulan anak magang pembuat kopi latte art berbentuk gambar wajah Kapten Klu yang sedang merencanakan mogok kerja massal di kedai kopi pusat.",
          category: "Organisasi" 
        },
      ],
    },
    {
      title: "Chapter 3: Pencurian di Museum Kota",
      chapterNote: "Mahkota emas hilang dari etalase museum. Kapten Klu mendeteksi jejak infiltrasi agen Bayangan.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "MUSEUM", 
          difficulty: "MEDIUM", 
          clueHonest: "Gedung pameran benda-benda sejarah dan artefak kuno.", 
          clueMisleading: "Tempat penyimpanan artefak purbakala M-U-S-E-U-M. \n\nSebenarnya itu adalah gedung bioskop tua terbengkalai tempat para hantu berkumpul setiap malam jumat kliwon hanya untuk menonton film kartun komedi anak-anak.",
          category: "Lokasi" 
        },
        { 
          text: "EMAS", 
          difficulty: "EASY", 
          clueHonest: "Logam mulia kuning berkilau yang sangat berharga.", 
          clueMisleading: "Logam mulia kuning mengkilap berharga E-M-A-S. \n\nTapi ingatlah, itu adalah lelehan mentega margarin kuning di atas wajan panas yang memantulkan sinar lampu neon sehingga terlihat berkilau seperti harta karun asli!",
          category: "Barang" 
        },
        { 
          text: "MAHKOTA", 
          difficulty: "MEDIUM", 
          clueHonest: "Hiasan kepala simbol kekuasaan tertinggi raja atau ratu.", 
          clueMisleading: "Hiasan kepala logam mulia melingkar M-A-H-K-O-T-A. \n\nPadahal itu adalah alat pemijat kepala otomatis berbentuk cakar gurita besi yang ditenagai batu baterai ABC bekas agar raja tidak pusing memikirkan rakyatnya.",
          category: "Barang" 
        },
        { 
          text: "PENJAGA", 
          difficulty: "MEDIUM", 
          clueHonest: "Petugas yang bertugas mengawasi dan mengamankan lokasi.", 
          clueMisleading: "Petugas patroli malam keamanan P-E-N-J-A-G-A. \n\nSalah! Dia sebenarnya adalah boneka manekin kayu berpakaian seragam satpam yang dipasang sensor suara bebek mainan agar berbunyi kwek-kwek saat disentuh penyusup.",
          category: "Profesi" 
        },
        { 
          text: "ALARM", 
          difficulty: "EASY", 
          clueHonest: "Sirine peringatan dini saat mendeteksi bahaya atau penyusupan.", 
          clueMisleading: "Sinyal suara sirine peringatan bahaya A-L-A-R-M. \n\nKetahuilah, itu adalah suara alarm jam beker merah berbentuk ayam jago milik Kapten Klu yang disetel jam 4 subuh tapi selalu ia matikan karena masih mengantuk berat.",
          category: "Peralatan" 
        },
      ],
    },
    {
      title: "Chapter 4: Teka-Teki Labirin Cermin",
      chapterNote: "Kapten Klu terjebak di taman hiburan tua yang diubah Bayangan menjadi labirin cermin Penuh ilusi.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "CERMIN", 
          difficulty: "EASY", 
          clueHonest: "Kaca bening berlapis yang memantulkan bayangan secara utuh.", 
          clueMisleading: "Kaca perak pemantul bayangan wajah C-E-R-M-I-N. \n\nPadahal itu adalah permukaan kolam air es beku berlapis minyak goreng bening yang sengaja didesain agar Kapten Klu terpeleset jatuh saat bercermin ria.",
          category: "Peralatan" 
        },
        { 
          text: "LABIRIN", 
          difficulty: "MEDIUM", 
          clueHonest: "Jaringan jalan rumit berliku dengan banyak lorong buntu.", 
          clueMisleading: "Jalur teka-teki berliku membingungkan L-A-B-I-R-I-N. \n\nSebenarnya itu adalah rancangan denah kandang tikus putih milik laboratorium sains yang tersesat mencari keju cheddar berlapis saus sambal pedas manis.",
          category: "Misteri" 
        },
        { 
          text: "ILUSI", 
          difficulty: "MEDIUM", 
          clueHonest: "Tipuan pandangan mata yang membuat sesuatu tampak berbeda.", 
          clueMisleading: "Tipuan visual pandangan mata kosong I-L-U-S-I. \n\nPadahal itu hanyalah bayangan efek fatamorgana gurun pasir akibat detektif terlalu banyak minum kopi tanpa gula di bawah terik matahari siang hari.",
          category: "Psikologi" 
        },
        { 
          text: "PANTUL", 
          difficulty: "MEDIUM", 
          clueHonest: "Gerakan membalikkan kembali gelombang atau benda yang menumbuk.", 
          clueMisleading: "Efek memantul kembali gelombang cahaya P-A-N-T-U-L. \n\nSebenarnya itu adalah gaya memantul bola tenis karet warna hijau yang dilempar Kapten Klu ke tembok kamar saat ia merasa bosan tidak ada kasus misteri baru.",
          category: "Fisika" 
        },
        { 
          text: "KACA", 
          difficulty: "EASY", 
          clueHonest: "Bahan keras transparan yang umumnya digunakan pada jendela.", 
          clueMisleading: "Material bening rapuh transparan K-A-C-A. \n\nPadahal itu adalah lempengan gula batu raksasa hasil eksperimen koki istana yang dibuat keras agar bisa digunakan sebagai lensa kacamata pembesar detektif.",
          category: "Material" 
        },
      ],
    },
    {
      title: "Chapter 5: Konfrontasi di Menara Jam",
      chapterNote: "Kapten Klu berhadapan langsung dengan Bayangan di puncak Menara Jam Kota saat tengah malam.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "MENARA", 
          difficulty: "MEDIUM", 
          clueHonest: "Bangunan tinggi menjulang yang berfungsi sebagai pemancar atau pengawas.", 
          clueMisleading: "Konstruksi bangunan tinggi menjulang M-E-N-A-R-A. \n\nSebenarnya itu adalah tiang gantungan jemuran baju raksasa milik dinas kebersihan kota yang dicat kuning terang agar tidak ditabrak pesawat terbang di malam hari.",
          category: "Bangunan" 
        },
        { 
          text: "JAM", 
          difficulty: "EASY", 
          clueHonest: "Alat penunjuk waktu berjarum atau berlayar digital.", 
          clueMisleading: "Alat penunjuk waktu berdetak nyaring J-A-M. \n\nPadahal itu adalah roda komidi putar mini tempat hamster peliharaan Bayangan berolahraga lari setiap pagi agar otot kakinya tetap perkasa mencuri keju.",
          category: "Peralatan" 
        },
        { 
          text: "WAKTU", 
          difficulty: "EASY", 
          clueHonest: "Rangkaian detik, menit, dan jam saat peristiwa terjadi.", 
          clueMisleading: "Dimensi rangkaian detik kehidupan W-A-K-T-U. \n\nBukan main, itu adalah merek sabun cuci piring wangi jeruk nipis yang digunakan asisten detektif untuk membersihkan cangkir kopi setelah rapat rahasia.",
          category: "Dimensi" 
        },
        { 
          text: "PUNCAK", 
          difficulty: "EASY", 
          clueHonest: "Bagian tertinggi atau ujung atas suatu bangunan/gunung.", 
          clueMisleading: "Bagian ujung teratas ketinggian P-U-N-C-A-K. \n\nFaktanya, itu adalah nama villa peristirahatan di pegunungan sejuk tempat Kapten Klu berlibur memancing ikan mas sambil memakan jagung bakar mentega pedas.",
          category: "Lokasi" 
        },
        { 
          text: "MENANG", 
          difficulty: "EASY", 
          clueHonest: "Kondisi berhasil mengalahkan lawan atau memecahkan soal.", 
          clueMisleading: "Kondisi keberhasilan mengalahkan musuh M-E-N-A-N-G. \n\nJangan bangga dulu! Itu adalah nama pelabuhan penangkapan ikan teri di ujung timur pulau komodo tempat para nelayan berkumpul bertukar cerita lucu komik.",
          category: "Status" 
        },
      ],
    },
    {
      title: "Chapter 6: Monumen Megah Nusantara",
      chapterNote: "Penyelidikan berlanjut ke Jakarta. Tugu ikonik dengan lidah api berlapis emas menjadi saksi bisu rahasia sejarah.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "MONAS", 
          difficulty: "EASY", 
          clueHonest: "Monumen Nasional setinggi 132 meter di Lapangan Medan Merdeka.", 
          clueMisleading: "Tugu ikonik berujung lidah api emas M-O-N-A-S. \n\nBukan main! Itu sebenarnya adalah tiang pemancar sinyal radio amatir yang dibuat oleh warga sekitar agar bisa mendengarkan lagu dangdut melayu favorit setiap sore.",
          category: "Geografi" 
        },
        { 
          text: "GARUDA", 
          difficulty: "EASY", 
          clueHonest: "Burung mitologi agung yang menjadi Lambang Negara Indonesia.", 
          clueMisleading: "Lambang burung sakti negara G-A-R-U-D-A. \n\nPadahal itu adalah nama kedai ayam goreng tepung krispi pinggir jalan langganan para asisten laboratorium saat tanggal tua mendekat.",
          category: "Sejarah" 
        },
        { 
          text: "ISTANA", 
          difficulty: "MEDIUM", 
          clueHonest: "Kediaman resmi kepala negara atau tempat pemerintahan berkantor.", 
          clueMisleading: "Gedung kediaman megah kepala negara I-S-T-A-N-A. \n\nSalah besar! Itu adalah miniatur rumah-rumahan dari stik es krim buatan anak SD yang dipajang di pameran seni rupa tingkat kecamatan.",
          category: "Bangunan" 
        },
        { 
          text: "BENDERA", 
          difficulty: "EASY", 
          clueHonest: "Kain Merah Putih simbol kedaulatan dan kebanggaan bangsa.", 
          clueMisleading: "Kain Merah Putih simbol negara B-E-N-D-E-R-A. \n\nFaktanya, itu adalah kain jemuran handuk warna merah muda yang tidak sengaja terbang tertiup angin kencang hingga menyangkut di atas pohon mangga tetangga.",
          category: "Simbol" 
        },
        { 
          text: "SEJARAH", 
          difficulty: "MEDIUM", 
          clueHonest: "Catatan kejadian nyata di masa lalu yang dipelajari manusia.", 
          clueMisleading: "Catatan masa lampau peradaban manusia S-E-J-A-R-A-H. \n\nPadahal itu adalah nama novel romansa fiksi ilmiah tentang perjalanan cinta robot pembuat teh otomatis dengan mesin cuci piring berteknologi AI.",
          category: "Literasi" 
        },
      ],
    },
    {
      title: "Chapter 7: Keajaiban Candi Borobudur",
      chapterNote: "Di Magelang, Kapten Klu menjelajahi kemegahan stupa batu dari abad ke-8 peninggalan Dinasti Syailendra.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "BOROBUDUR", 
          difficulty: "MEDIUM", 
          clueHonest: "Candi Buddha terbesar di dunia yang terletak di Jawa Tengah.", 
          clueMisleading: "Candi megah bersejarah Buddha B-O-R-O-B-U-D-U-R. \n\nPadahal itu adalah tumpukan balok lego mainan anak-anak berwarna abu-abu yang disusun menyerupai stupa raksasa di ruang tengah rumah dinas detektif.",
          category: "Sejarah" 
        },
        { 
          text: "CANDI", 
          difficulty: "EASY", 
          clueHonest: "Bangunan batu kuno tempat pemujaan dan peninggalan purbakala.", 
          clueMisleading: "Situs batu purbakala bersejarah C-A-N-D-I. \n\nSebenarnya itu adalah tumpukan kardus mi instan kosong yang diletakkan di gudang belakang toko kelontong sebelum diangkut oleh truk pemulung.",
          category: "Arsitektur" 
        },
        { 
          text: "STUPA", 
          difficulty: "MEDIUM", 
          clueHonest: "Bangunan berbentuk mangkuk terbalik atau lonceng pada candi.", 
          clueMisleading: "Bangunan stupa batu berbentuk lonceng S-T-U-P-A. \n\nPadahal itu adalah tudung saji penutup nasi bermotif jaring-jaring plastik warna hijau untuk melindungi lauk pauk dari hinggapan lalat rumah.",
          category: "Arsitektur" 
        },
        { 
          text: "RELIEF", 
          difficulty: "HARD", 
          clueHonest: "Seni pahatan ukiran batu yang menonjol pada dinding candi.", 
          clueMisleading: "Seni pahatan dinding batu bersejarah R-E-L-I-E-F. \n\nSalah! Itu sebenarnya nama salep pereda nyeri otot punggung akibat detektif terlalu lama duduk membungkuk mengetik laporan kasus seharian.",
          category: "Kesenian" 
        },
        { 
          text: "PATUNG", 
          difficulty: "EASY", 
          clueHonest: "Karya seni tiga dimensi yang dipahat menyerupai manusia/hewan.", 
          clueMisleading: "Seni patung pahatan tiga dimensi P-A-T-U-N-G. \n\nFaktanya, itu adalah orang-orangan sawah dari jerami berpakaian baju kaos bekas untuk menakut-nakuti burung pipit yang memakan padi di sawah.",
          category: "Kesenian" 
        },
      ],
    },
    {
      title: "Chapter 8: Pesona Danau Toba",
      chapterNote: "Menjelajahi danau vulkanik terbesar di Asia Tenggara yang terbentuk dari letusan dahsyat gunung super purba.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "TOBA", 
          difficulty: "EASY", 
          clueHonest: "Danau vulkanik raksasa dengan Pulau Samosir di tengahnya.", 
          clueMisleading: "Danau supervulkanik legendaris T-O-B-A. \n\nSebenarnya itu adalah nama singkatan dari Toko Baju Anak-anak murah meriah di dekat pasar malam yang sering mengadakan diskon besar-besaran setiap akhir tahun.",
          category: "Geografi" 
        },
        { 
          text: "DANAU", 
          difficulty: "EASY", 
          clueHonest: "Genangan air luas yang dikelilingi oleh daratan di sekitarnya.", 
          clueMisleading: "Kumpulan air luas dikelilingi daratan D-A-N-A-U. \n\nPadahal itu hanyalah genangan air comberan hujan di jalan berlubang depan gang yang sering membuat pengendara motor kecipratan lumpur hitam.",
          category: "Geografi" 
        },
        { 
          text: "VULKANIK", 
          difficulty: "HARD", 
          clueHonest: "Proses atau bentukan yang berkaitan dengan aktivitas gunung berapi.", 
          clueMisleading: "Aktivitas vulkanik magma berapi V-U-L-K-A-N-I-K. \n\nPadahal itu adalah cairan saus cabai ekstra pedas buatan warung bakso mercon yang membuat perut Kapten Klu mulas setengah mati setelah makan malam.",
          category: "Sains" 
        },
        { 
          text: "PULAU", 
          difficulty: "EASY", 
          clueHonest: "Daratan yang seluruh sisinya dikelilingi oleh perairan.", 
          clueMisleading: "Daratan darat terisolasi keliling air P-U-L-A-U. \n\nSalah! Itu sebenarnya piring anyaman bambu tempat menyajikan nasi uduk hangat lengkap dengan taburan bawang goreng harum gurih.",
          category: "Geografi" 
        },
        { 
          text: "SAMOSIR", 
          difficulty: "MEDIUM", 
          clueHonest: "Pulau yang terletak persis di tengah-tengah Danau Toba.", 
          clueMisleading: "Pulau Samosir di tengah danau S-A-M-O-S-I-R. \n\nSebenarnya itu nama sisir rambut ajaib milik Bayangan yang bisa merapikan rambut kusut hanya dalam sekali usap tanpa perlu cermin.",
          category: "Geografi" 
        },
      ],
    },
    {
      title: "Chapter 9: Surga Bahari Raja Ampat",
      chapterNote: "Menyelami gugusan pulau karang Papua yang menjadi pusat keanekaragaman hayati laut terkaya di planet Bumi.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "AMPAT", 
          difficulty: "EASY", 
          clueHonest: "Angka empat dalam sebutan nama gugusan kepulauan eksotis Papua.", 
          clueMisleading: "Gugusan kepulauan eksotis Papua A-M-P-A-T. \n\nJangan salah! Itu sebenarnya jumlah mangkok kosong bekas detektif makan mi bakso urat di warung makan pinggir jalan dekat stasiun.",
          category: "Geografi" 
        },
        { 
          text: "TERUMBU", 
          difficulty: "MEDIUM", 
          clueHonest: "Struktur batu kapur di laut yang dihasilkan oleh organisme koral.", 
          clueMisleading: "Kumpulan terumbu karang koral laut T-E-R-U-M-B-U. \n\nFaktanya, itu adalah nama jenis kerupuk putih kaleng warung yang melempem karena tutup kalengnya tidak rapat ditutup oleh asisten dapur.",
          category: "Kelautan" 
        },
        { 
          text: "KARANG", 
          difficulty: "EASY", 
          clueHonest: "Hewan laut kecil yang membentuk koloni batuan di dasar laut.", 
          clueMisleading: "Struktur koral keras bawah air K-A-R-A-N-G. \n\nPadahal itu adalah nama penulis novel fiksi detektif terpopuler yang buku-bukunya selalu laris manis dibeli oleh Kapten Klu untuk mengisi waktu luang.",
          category: "Kelautan" 
        },
        { 
          text: "LAUT", 
          difficulty: "EASY", 
          clueHonest: "Kumpulan air asin luas yang menghubungkan antar benua dan pulau.", 
          clueMisleading: "Kumpulan air asin luas benua L-A-U-T. \n\nSebenarnya itu adalah nama merk kecap manis asin botolan yang biasa digunakan untuk membumbui masakan nasi goreng kambing di malam hari.",
          category: "Geografi" 
        },
        { 
          text: "SELAM", 
          difficulty: "EASY", 
          clueHonest: "Aktivitas menyelam ke dalam air menggunakan peralatan tabung oksigen.", 
          clueMisleading: "Aktivitas menyelam bawah air koral S-E-L-A-M. \n\nSalah! Itu sebenarnya adalah salam penutup pembicaraan formal saat Kapten Klu berpidato di acara syukuran ulang tahun kota.",
          category: "Olahraga" 
        },
      ],
    },
    {
      title: "Chapter 10: Warisan Budaya Batik",
      chapterNote: "Menyelidiki teknik menorehkan malam di atas kain mori menggunakan canting. Karya seni lukis asli Nusantara.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "BATIK", 
          difficulty: "EASY", 
          clueHonest: "Kain bergambar bergaya khas buatan Indonesia dengan perintang malam.", 
          clueMisleading: "Seni lukis kain perintang malam B-A-T-I-K. \n\nPadahal itu adalah nama merk penghapus karet hitam yang sering hilang di kelas karena sering dipinjam oleh teman sebangku.",
          category: "Budaya" 
        },
        { 
          text: "CANTING", 
          difficulty: "MEDIUM", 
          clueHonest: "Alat kecil berpencurut untuk menorehkan cairan malam pada kain.", 
          clueMisleading: "Alat kecil lilin malam batik C-A-N-T-I-N-G. \n\nFaktanya, itu adalah mangkok sambal cobek batu kecil tempat menyajikan sambal terasi pedas segar buatan ibu mertua.",
          category: "Peralatan" 
        },
        { 
          text: "KAIN", 
          difficulty: "EASY", 
          clueHonest: "Bahan tekstil tenunan yang digunakan untuk pakaian dan seni.", 
          clueMisleading: "Bahan tenun pakaian mori K-A-I-N. \n\nSebenarnya itu adalah lembaran tisu toilet gulung yang sering dipakai detektif untuk membersihkan lensa kacamata pembesarnya dari debu.",
          category: "Material" 
        },
        { 
          text: "MOTIF", 
          difficulty: "EASY", 
          clueHonest: "Polam corak hiasan atau bentuk berulang pada karya seni batik.", 
          clueMisleading: "Corak pola hiasan berulang batik M-O-T-I-F. \n\nSalah! Itu sebenarnya adalah alasan rahasia kenapa Bayangan suka mencuri tinta komik, padahal ia hanya ingin mewarnai buku gambar anak-anak.",
          category: "Kesenian" 
        },
        { 
          text: "NATIVE", 
          difficulty: "MEDIUM", 
          clueHonest: "Istilah bahasa inggris untuk warisan atau warga asli setempat.", 
          clueMisleading: "Istilah warga asli setempat N-A-T-I-V-E. \n\nPadahal itu adalah nama program aplikasi pembuat kopi otomatis di ponsel pintar Kapten Klu agar ia tidak terlambat bangun pagi.",
          category: "Istilah" 
        },
      ],
    },
    {
      title: "Chapter 11: Seni Pertunjukan Wayang",
      chapterNote: "Layar kelir terbentang. Dalang menggerakkan tokoh kulit menceritakan wiracarita Ramayana dan Mahabharata.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "WAYANG", 
          difficulty: "EASY", 
          clueHonest: "Seni pertunjukan boneka kulit atau kayu asli budaya Nusantara.", 
          clueMisleading: "Seni boneka kulit layar kelir W-A-Y-A-N-G. \n\nPadahal itu adalah bayangan hitam jemuran pakaian di luar jendela kamar yang terlihat menakutkan seperti hantu di malam hari.",
          category: "Budaya" 
        },
        { 
          text: "DALANG", 
          difficulty: "MEDIUM", 
          clueHonest: "Sutradara sekaligus narator yang memainkan wayang di belakang layar.", 
          clueMisleading: "Narator sutradara boneka kulit D-A-L-A-N-G. \n\nFaktanya, itu adalah nama jenis pisang goreng tepung hangat manis krispi yang dijual di warung gorengan dekat stasiun kereta.",
          category: "Profesi" 
        },
        { 
          text: "KELIR", 
          difficulty: "HARD", 
          clueHonest: "Layar kain putih tempat bayangan wayang dipantulkan saat pentas.", 
          clueMisleading: "Layar kain putih pentas wayang K-E-L-I-R. \n\nSebenarnya itu adalah salah satu jenis warna lipstik merah muda favorit asisten administrasi kantor polisi tempat detektif melapor.",
          category: "Peralatan" 
        },
        { 
          text: "GAMELAN", 
          difficulty: "MEDIUM", 
          clueHonest: "Ensemble musik tradisional Jawa yang didominasi instrumen gong dan saron.", 
          clueMisleading: "Alat musik perkusi saron gong G-A-M-E-L-A-N. \n\nSalah! Itu sebenarnya adalah nama arena game timezone tempat anak-anak bermain mesin capit boneka setiap hari minggu sore.",
          category: "Musik" 
        },
        { 
          text: "LAKON", 
          difficulty: "MEDIUM", 
          clueHonest: "Alur cerita atau peran tokoh yang dibawakan dalam pertunjukan.", 
          clueMisleading: "Alur cerita pentas wayang L-A-K-O-N. \n\nPadahal itu adalah jenis biskuit cokelat manis kesukaan asisten Bayangan yang biasa ia celupkan ke dalam segelas susu hangat sebelum tidur.",
          category: "Kesenian" 
        },
      ],
    },
    {
      title: "Chapter 12: Harmoni Alat Musik Angklung",
      chapterNote: "Alunan bilah bambu yang digoyangkan tercipta nada merdu. Alat musik bambu asal Jawa Barat warisan UNESCO.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "ANGKLUNG", 
          difficulty: "MEDIUM", 
          clueHonest: "Alat musik bernada ganda dari pipa bambu yang dibunyikan digoyangkan.", 
          clueMisleading: "Alat musik bambu goyang sunda A-N-G-K-L-U-N-G. \n\nPadahal itu adalah tiang bambu jemuran kerupuk pasir yang dipasang di halaman belakang rumah pembuat kerupuk.",
          category: "Musik" 
        },
        { 
          text: "BAMBU", 
          difficulty: "EASY", 
          clueHonest: "Tanaman rumput berkayu berongga yang tumbuh cepat di wilayah tropis.", 
          clueMisleading: "Tanaman rumput berongga kuning hijau B-A-M-B-U. \n\nFaktanya, itu adalah nama jenis sumpit kayu sekali pakai yang sering kamu dapatkan saat memesan mi ayam pangsit lewat aplikasi ojek online.",
          category: "Tanaman" 
        },
        { 
          text: "NADA", 
          difficulty: "EASY", 
          clueHonest: "Tinggi rendahnya bunyi dalam seni musik atau lagu.", 
          clueMisleading: "Tinggi rendah bunyi irama lagu N-A-D-A. \n\nSebenarnya itu adalah nama panggung penyanyi karaoke keliling yang suaranya fals tapi selalu percaya diri menyanyikan lagu rock barat.",
          category: "Musik" 
        },
        { 
          text: "MELODI", 
          difficulty: "EASY", 
          clueHonest: "Susunan urutan nada yang terdengar indah dan berirama.", 
          clueMisleading: "Susunan nada indah berirama M-E-L-O-D-I. \n\nSalah! Itu sebenarnya nama toko kosmetik langganan asisten Bayangan yang menjual lipstik merah menyala untuk menyamar di pesta dansa.",
          category: "Musik" 
        },
        { 
          text: "MUSIK", 
          difficulty: "EASY", 
          clueHonest: "Seni mengolah suara dan irama sehingga enak didengar oleh telinga.", 
          clueMisleading: "Seni suara irama harmonis M-U-S-I-K. \n\nPadahal itu adalah suara bising mesin blender juicer buah mangga milik detektif saat membuat sarapan pagi hari.",
          category: "Kesenian" 
        },
      ],
    },
    {
      title: "Chapter 13: Kuliner Khas Gado Gado",
      chapterNote: "Penyelidikan berlanjut ke pasar tradisional. Sayuran segar rebus disiram kuah kacang gurih khas Jakarta.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "GADO", 
          difficulty: "EASY", 
          clueHonest: "Nama makanan salad Indonesia berkuah bumbu kacang gurih manis.", 
          clueMisleading: "Makanan gado bumbu kacang gurih G-A-D-O. \n\nPadahal itu adalah nama merk lem kertas stik berwarna kuning yang biasa digunakan anak-anak untuk merekatkan kertas tugas prakarya sekolah.",
          category: "Kuliner" 
        },
        { 
          text: "KACANG", 
          difficulty: "EASY", 
          clueHonest: "Biji-bijian lezat bahan utama saus gurih pada hidangan gado-gado.", 
          clueMisleading: "Biji-bijian saus kuah gado-gado K-A-C-A-N-G. \n\nFaktanya, itu adalah nama jenis camilan kuaci biji bunga matahari asin gurih kesukaan Bayangan saat merenungkan rencana jail.",
          category: "Bahan" 
        },
        { 
          text: "BUMBU", 
          difficulty: "EASY", 
          clueHonest: "Rempah-rempah pengolah rasa masakan agar beraroma lezat.", 
          clueMisleading: "Rempah rasa penyedap makanan B-U-M-B-U. \n\nSebenarnya itu adalah nama merk bedak tabur bayi wangi lavender yang digunakan detektif agar kulitnya tidak biang keringat setelah berkejaran.",
          category: "Kuliner" 
        },
        { 
          text: "SAYUR", 
          difficulty: "EASY", 
          clueHonest: "Bahan pangan bergizi dari bagian tanaman seperti bayam dan tauge.", 
          clueMisleading: "Bahan pangan bergizi hijau segar S-A-Y-U-R. \n\nSalah! Itu sebenarnya adalah rumput alang-alang liar yang tumbuh subur di pot bunga teras rumah dinas detektif karena jarang disiram.",
          category: "Bahan" 
        },
        { 
          text: "KULINER", 
          difficulty: "MEDIUM", 
          clueHonest: "Segala hal yang berhubungan dengan seni dan olahan masakan makanan.", 
          clueMisleading: "Seni masakan makanan lezat K-U-L-I-N-E-R. \n\nPadahal itu adalah nama koran cetak mingguan yang memuat komik strip petualangan detektif Kapten Klu setiap hari sabtu pagi.",
          category: "Gaya Hidup" 
        },
      ],
    },
    {
      title: "Chapter 14: Kelezatan Rendang Nusantara",
      chapterNote: "Masakan daging olahan santan dan rempah khas Minangkabau yang pernah dinobatkan sebagai Makanan Terenak di Dunia.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "RENDANG", 
          difficulty: "EASY", 
          clueHonest: "Masakan daging pedas khas Sumatra Barat masak santan berjam-jam.", 
          clueMisleading: "Masakan daging santan minang R-E-N-D-A-N-G. \n\nPadahal itu adalah nama merk sandal jepit karet warna hijau-putih yang sering tertukar saat shalat jumat di masjid raya.",
          category: "Kuliner" 
        },
        { 
          text: "DAGING", 
          difficulty: "EASY", 
          clueHonest: "Bahan pangan protein utama olahan rendang pilihan masakan.", 
          clueMisleading: "Bahan protein utama sapi kambing D-A-G-I-N-G. \n\nFaktanya, itu adalah nama mainan karet gigitan anjing berbentuk tulang paha sapi yang sering dimainkan oleh hewan peliharaan tetangga.",
          category: "Bahan" 
        },
        { 
          text: "SANTAN", 
          difficulty: "EASY", 
          clueHonest: "Cairan putih gurih dari perasan parutan kelapa murni.", 
          clueMisleading: "Cairan putih kelapa gurih S-A-N-T-A-N. \n\nSebenarnya itu adalah merk pembersih kaca cair dalam botol semprot yang digunakan detektif untuk membersihkan jendela etalase ruang kerjanya.",
          category: "Bahan" 
        },
        { 
          text: "REMPAH", 
          difficulty: "MEDIUM", 
          clueHonest: "Bagian tumbuhan beraroma kuat seperti cengkeh, kayu manis, dan kapulaga.", 
          clueMisleading: "Bagian aromatik tanaman bumbu R-E-M-P-A-H. \n\nSalah! Itu sebenarnya remahan roti kering di atas piring bekas Kapten Klu makan kue donat cokelat saat begadang nonton TV semalam.",
          category: "Bahan" 
        },
        { 
          text: "PADANG", 
          difficulty: "EASY", 
          clueHonest: "Ibu kota Sumatra Barat yang terkenal dengan kelezatan rumah makannya.", 
          clueMisleading: "Kota minang asal kuliner rendang P-A-D-A-N-G. \n\nPadahal itu adalah padang rumput ilalang luas tempat para kerbau gembala merumput santai di siang hari yang panas terik.",
          category: "Geografi" 
        },
      ],
    },
    {
      title: "Chapter 15: Satwa Langka Komodo",
      chapterNote: "Di Nusa Tenggara Timur, Kapten Klu mengamati kadal purba raksasa terpanjang di dunia yang dilindungi dunia.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "KOMODO", 
          difficulty: "EASY", 
          clueHonest: "Spesies kadal terbesar di dunia yang hidup di pulau komodo NTT.", 
          clueMisleading: "Kadal purba raksasa NTT K-O-M-O-D-O. \n\nSebenarnya itu adalah nama merk motor matik cc besar kesukaan Bayangan yang knalpotnya bising sekali saat ia melarikan diri malam hari.",
          category: "Fauna" 
        },
        { 
          text: "NUSA", 
          difficulty: "EASY", 
          clueHonest: "Kata bahasa sansekerta yang berarti tanah air atau pulau-pulau.", 
          clueMisleading: "Kata pulau sansekerta N-U-S-A. \n\nFaktanya, itu adalah nama kapal feri penumpang penyeberangan selat Sunda yang sering digunakan para pemudik saat hari raya lebaran tiba.",
          category: "Istilah" 
        },
        { 
          text: "KADAL", 
          difficulty: "EASY", 
          clueHonest: "Kelompok reptil bersisik berkaki empat yang berkerabat dengan komodo.", 
          clueMisleading: "Kelompok reptil melata sisik K-A-D-A-L. \n\nSebenarnya itu adalah nama jenis dompet kulit imitasi murah meriah yang dijual di pedagang kaki lima trotoar pasar senen.",
          category: "Fauna" 
        },
        { 
          text: "KANIBAL", 
          difficulty: "HARD", 
          clueHonest: "Sifat organisme yang memakan sesama jenis spesiesnya sendiri.", 
          clueMisleading: "Sifat memakan sesama jenis biologi K-A-N-I-B-A-L. \n\nSalah! Itu sebenarnya nama merk permen asam manis rasa jahe hangat yang disukai asisten detektif untuk meredakan mual mabuk perjalanan.",
          category: "Biologi" 
        },
        { 
          text: "TAMAN", 
          difficulty: "EASY", 
          clueHonest: "Kawasan pelestarian alam teradu untuk melindungi flora fauna langka.", 
          clueMisleading: "Kawasan pelestarian alam nasional T-A-M-A-N. \n\nPadahal itu adalah taman bermain anak-anak yang dilengkapi perosotan dan ayunan besi tua berkarat di dekat kantor kelurahan.",
          category: "Lokasi" 
        },
      ],
    },
    {
      title: "Chapter 16: Habitat Anggun Anoa",
      chapterNote: "Menyusuri hutan hujan Sulawesi untuk menemukan kerbau kerdil endemik langka berpenampilan mirip rusa.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "ANOA", 
          difficulty: "MEDIUM", 
          clueHonest: "Kerbau kerdil/endemik Sulawesi yang berukuran kecil dan dilindungi.", 
          clueMisleading: "Kerbau kerdil langka Sulawesi A-N-O-A. \n\nPadahal itu adalah nama jenis helikopter mainan remote control warna kuning-hitam milik anak tetangga yang sering tersangkut di genteng.",
          category: "Fauna" 
        },
        { 
          text: "SULAWESI", 
          difficulty: "EASY", 
          clueHonest: "Pulau di Indonesia yang berbentuk mirip huruf K.", 
          clueMisleading: "Pulau besar berbentuk K S-U-L-A-W-E-S-I. \n\nFaktanya, itu adalah nama jenis es kelapa muda campur sirup melon manis segar yang sering diminum Kapten Klu saat hari sedang panas menyengat.",
          category: "Geografi" 
        },
        { 
          text: "MAMALIA", 
          difficulty: "MEDIUM", 
          clueHonest: "Hewan menyusui yang melahirkan anak dan berdarah panas.", 
          clueMisleading: "Hewan menyusui berdarah panas M-A-M-A-L-I-A. \n\nSebenarnya itu adalah nama kacamata hitam canggih pendeteksi panas tubuh buatan laboratorium musuh untuk melacak keberadaan detektif di hutan.",
          category: "Biologi" 
        },
        { 
          text: "TANDUK", 
          difficulty: "EASY", 
          clueHonest: "Struktur keras di kepala beberapa mamalia untuk perlindungan.", 
          clueMisleading: "Struktur runcing keras kepala T-A-N-D-U-K. \n\nSalah! Itu sebenarnya aksesoris bando kuping kelinci mainan yang dipakai asisten Bayangan agar terlihat imut saat festival malam kota.",
          category: "Biologi" 
        },
        { 
          text: "HUTAN", 
          difficulty: "EASY", 
          clueHonest: "Wilayah luas ditumbuhi pepohonan lebat yang menjadi paru-paru bumi.", 
          clueMisleading: "Wilayah pepohonan lebat tropis H-U-T-A-N. \n\nPadahal itu hanyalah taman kecil buatan di dalam mall perbelanjaan megah yang dipenuhi tanaman plastik dan kolam ikan mas koi buatan.",
          category: "Lingkungan" 
        },
      ],
    },
    {
      title: "Chapter 17: Satwa Perkasa Harimau",
      chapterNote: "Jejak cakar di batang pohon rimba Sumatra. Pemangsa puncak berbulu loreng oranye hitam yang sangat agung.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "HARIMAU", 
          difficulty: "EASY", 
          clueHonest: "Kucing besar pemangsa berbulu oranye bergaris loreng hitam.", 
          clueMisleading: "Pemangsa loreng kucing besar H-A-R-I-M-A-U. \n\nPadahal itu adalah nama jubah rajutan wol motif macan tutul yang dibeli asisten detektif dari pasar loak dengan harga sangat murah.",
          category: "Fauna" 
        },
        { 
          text: "SUMATRA", 
          difficulty: "EASY", 
          clueHonest: "Pulau besar di barat Indonesia habitat harimau dan gajah.", 
          clueMisleading: "Pulau habitat harimau sumatra S-U-M-A-T-R-A. \n\nFaktanya, itu adalah nama kedai kopi tubruk pahit hangat langganan detektif saat meronda keliling kota super di malam minggu.",
          category: "Geografi" 
        },
        { 
          text: "LORENG", 
          difficulty: "EASY", 
          clueHonest: "Pola garis-garis beruntun pada bulu harimau atau pakaian militer.", 
          clueMisleading: "Pola garis hitam harimau L-O-R-E-N-G. \n\nSebenarnya itu adalah warna pita hadiah pembungkus kado berisi petunjuk palsu Bayangan yang diletakkan di teras kantor detektif.",
          category: "Pola" 
        },
        { 
          text: "RAKSASA", 
          difficulty: "EASY", 
          clueHonest: "Ukuran tubuh yang jauh lebih besar dari ukuran normal umumnya.", 
          clueMisleading: "Ukuran sangat besar raksasa R-A-K-S-A-S-A. \n\nSalah! Itu sebenarnya nama boneka beruang berbulu cokelat besar yang dipeluk Kapten Klu saat tidur malam hari agar tidak kedinginan.",
          category: "Ukuran" 
        },
        { 
          text: "RIMBA", 
          difficulty: "MEDIUM", 
          clueHonest: "Hutana lebat belantara yang masih alami dan jarang terjamah manusia.", 
          clueMisleading: "Hutan belantara lebat alami R-I-M-B-A. \n\nPadahal itu adalah nama tim sepak bola lokal anak-anak kompleks yang selalu kalah telak setiap kali tanding di lapangan kelurahan.",
          category: "Lingkungan" 
        },
      ],
    },
    {
      title: "Chapter 18: Pesona Bunga Rafflesia",
      chapterNote: "Bunga raksasa tanpa daun yang mengeluarkan aroma menyengat saat mekar sempurna di hutan Bengkulu.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "RAFFLESIA", 
          difficulty: "HARD", 
          clueHonest: "Bunga parasit raksasa terbesar tanpa batang atau daun asli Bengkulu.", 
          clueMisleading: "Bunga terbesar tanpa daun R-A-F-F-L-E-S-I-A. \n\nPadahal itu adalah nama merek parfum semprot wangi mawar mewah kesukaan asisten Bayangan yang ia beli dari toko online.",
          category: "Botani" 
        },
        { 
          text: "RAWA", 
          difficulty: "EASY", 
          clueHonest: "Lahan genangan air dangkal yang ditumbuhi berbagai tanaman air.", 
          clueMisleading: "Lahan basah genangan air R-A-W-A. \n\nFaktanya, itu adalah kolam ikan hias kecil di teras rumah Kapten Klu yang dipenuhi lumut hijau karena malas dibersihkan.",
          category: "Lingkungan" 
        },
        { 
          text: "MEKAR", 
          difficulty: "EASY", 
          clueHonest: "Proses mengembang indahnya mahkota bunga saat berkembang sempurna.", 
          clueMisleading: "Proses berkembang kuncup bunga M-E-K-A-R. \n\nSebenarnya itu adalah bunyi balon meletus dar ketika terkena jarum tajam mainan yang dilempar oleh anak tetangga.",
          category: "Botani" 
        },
        { 
          text: "AROMA", 
          difficulty: "EASY", 
          clueHonest: "Bau khas tajam menyengat yang dipancarkan oleh bunga tertentu.", 
          clueMisleading: "Bau khas menyengat bunga A-R-O-M-A. \n\nSalah! Itu sebenarnya adalah bau gurih mi instan rebus rasa soto lamongan pakai cabai rawit yang sedang dimasak asisten detektif di dapur.",
          category: "Sensori" 
        },
        { 
          text: "BOTANI", 
          difficulty: "HARD", 
          clueHonest: "Cabang ilmu biologi yang mempelajari tumbuh-tumbuhan secara ilmiah.", 
          clueMisleading: "Ilmu sains tumbuh-tumbuhan B-O-T-A-N-I. \n\nPadahal itu adalah nama studio komik indie tempat komikus menggambar petualangan Kapten Klu dan Bayangan secara berkala.",
          category: "Sains" 
        },
      ],
    },
    {
      title: "Chapter 19: Keindahan Gunung Bromo",
      chapterNote: "Pesona kawah aktif dengan hamparan lautan pasir bisik yang memukau saat matahari terbit di Jawa Timur.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "BROMO", 
          difficulty: "EASY", 
          clueHonest: "Gunung berapi aktif terkenal di kawasan Taman Nasional Bromo Tengger.", 
          clueMisleading: "Gunung berapi aktif Jawa Timur B-R-O-M-O. \n\nSebenarnya itu adalah nama merk biskuit gandum manis isi selai cokelat yang dibeli detektif dari minimarket terdekat.",
          category: "Geografi" 
        },
        { 
          text: "KAWAH", 
          difficulty: "MEDIUM", 
          clueHonest: "Lubang besar berbentuk kawah hasil letusan berapi berisikan asap/belerang.", 
          clueMisleading: "Lubang besar puncak gunung K-A-W-A-H. \n\nFaktanya, itu adalah mangkok kaca besar tempat menyajikan es buah campur susu manis rasa durian pada acara buka puasa bersama.",
          category: "Geografi" 
        },
        { 
          text: "ERUPSI", 
          difficulty: "HARD", 
          clueHonest: "Fenomena letusan gunung berapi yang mengeluarkan material vulkanik.", 
          clueMisleading: "Fenomena letusan vulkanik berapi E-R-U-P-S-I. \n\nSebenarnya itu adalah sorak gembira penonton konser musik dangdut saat penyanyi idolanya naik ke atas panggung.",
          category: "Sains" 
        },
        { 
          text: "PASIR", 
          difficulty: "EASY", 
          clueHonest: "Butiran halus batuan yang membentang di lautan pasir Bromo.", 
          clueMisleading: "Butiran halus batuan pasir P-A-S-I-R. \n\nSalah! Itu sebenarnya adalah gula pasir putih kristal manis bahan utama pembuat kopi susu hangat favorit Kapten Klu setiap pagi.",
          category: "Material" 
        },
        { 
          text: "SUNRISE", 
          difficulty: "MEDIUM", 
          clueHonest: "Momen fajar terbitnya matahari dari ufuk timur yang sangat indah.", 
          clueMisleading: "Momen matahari terbit fajar S-U-N-R-I-S-E. \n\nPadahal itu adalah nama merk jus jeruk instan botolan rasa jeruk peras manis asam dingin yang dijual di kantin sekolah.",
          category: "Fenomena" 
        },
      ],
    },
    {
      title: "Chapter 20: Kejayaan Kerajaan Majapahit",
      chapterNote: "Sumpah Palapa Patih Gajah Mada menggetarkan Nusantara di bawah panji kejayaan Kerajaan Majapahit.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "MAJAPAHIT", 
          difficulty: "HARD", 
          clueHonest: "Kerajaan bahari purba terbesar Nusantara berpusat di Jawa Timur.", 
          clueMisleading: "Kerajaan bahari purba Nusantara M-A-J-A-P-A-H-I-T. \n\nPadahal itu adalah nama warung kopi legendaris penyedia kopi hitam cangkir tanah liat di dekat alun-alun kota.",
          category: "Sejarah" 
        },
        { 
          text: "SUMPAH", 
          difficulty: "MEDIUM", 
          clueHonest: "Janji suci teguh yang diucapkan untuk menyatukan wilayah Nusantara.", 
          clueMisleading: "Janji suci ikrar persatuan S-U-M-P-A-H. \n\nFaktanya, itu adalah mantra ajaib pemanggil helikopter penyelamat yang sering diucapkan anak-anak saat bermain perang-perangan di lapangan.",
          category: "Sejarah" 
        },
        { 
          text: "PALAPA", 
          difficulty: "MEDIUM", 
          clueHonest: "Nama sumpah ikrar terkenal yang diucapkan oleh Mahapatih Gajah Mada.", 
          clueMisleading: "Nama sumpah patih gajah mada P-A-L-A-P-A. \n\nSebenarnya itu adalah nama merk buah nangka muda gurih santan masakan sayur lodeh buatan koki istana.",
          category: "Sejarah" 
        },
        { 
          text: "HAYAM", 
          difficulty: "MEDIUM", 
          clueHonest: "Nama raja penguasa kejayaan Majapahit yang bergelar Hayam Wuruk.", 
          clueMisleading: "Nama raja agung Majapahit H-A-Y-A-M. \n\nSalah! Itu sebenarnya nama panggilan akrab asisten Kapten Klu yang suka makan mi ayam pangsit kuah bening rasa gurih.",
          category: "Sejarah" 
        },
        { 
          text: "GAJAH", 
          difficulty: "EASY", 
          clueHonest: "Mamalia darat berbelalai raksasa sekaligus gelar patih pemberani.", 
          clueMisleading: "Mamalia belalai raksasa belantara G-A-J-A-H. \n\nPadahal itu adalah mainan karet tiup berbentuk gajah warna pink yang berbunyi cicit-cicit saat ditekan oleh bayi tetangga.",
          category: "Sejarah" 
        },
      ],
    },
    {
      title: "Chapter 21: Ibu Kota Baru Nusantara",
      chapterNote: "Babak baru pembangunan ibu kota hijau berteknologi modern di Penajam Paser Utara, Kalimantan Timur.",
      unlockComicImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      words: [
        { 
          text: "IKN", 
          difficulty: "EASY", 
          clueHonest: "Singkatan dari Ibu Kota Nusantara yang baru dibangun pemerintah.", 
          clueMisleading: "Singkatan Ibu Kota Nusantara I-K-N. \n\nBukan main! Itu sebenarnya nama singkatan Ikatan Kucing Nakal perumahan yang suka mencuri ikan asin goreng di dapur warga.",
          category: "Modern" 
        },
        { 
          text: "PENAJAM", 
          difficulty: "HARD", 
          clueHonest: "Kabupaten lokasi pembangunan kawasan inti pusat pemerintahan IKN.", 
          clueMisleading: "Kabupaten lokasi pembangunan IKN P-E-N-A-J-A-M. \n\nFaktanya, itu adalah nama jenis asahan pisau dapur otomatis terbuat dari batu kali hitam buatan pandai besi desa.",
          category: "Geografi" 
        },
        { 
          text: "BORNEO", 
          difficulty: "MEDIUM", 
          clueHonest: "Nama internasional bagi Pulau Kalimantan yang kaya akan hutan.", 
          clueMisleading: "Nama internasional pulau Kalimantan B-O-R-N-E-O. \n\nSebenarnya itu adalah nama merk cokelat batang manis impor dengan isian kacang almond krispi rasa vanilla.",
          category: "Geografi" 
        },
        { 
          text: "MODERN", 
          difficulty: "EASY", 
          clueHonest: "Konsep tata kota berteknologi masa kini yang ramah lingkungan.", 
          clueMisleading: "Konsep masa kini teknologi baru M-O-D-E-R-N. \n\nSalah! Itu sebenarnya nama aliran musik dansa cha-cha tempo dulu yang disukai kakek nenek saat acara reuni keluarga.",
          category: "Konsep" 
        },
        { 
          text: "SMARTHUB", 
          difficulty: "HARD", 
          clueHonest: "Pusat konektivitas cerdas berteknologi canggih bagi warga kota.", 
          clueMisleading: "Pusat konektivitas cerdas IKN S-M-A-R-T-H-U-B. \n\nPadahal itu adalah nama merk charger baterai isi ulang otomatis berbentuk gurita plastik warna kuning-hitam.",
          category: "Teknologi" 
        },
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

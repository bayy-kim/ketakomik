export interface FallbackWord {
  id: string;
  text: string;
  normalizedText: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  clueHonest: string;
  clueMisleading: string;
  scheduledDate: string;
  category: string;
  chapterId?: string;
}

export interface FallbackChapter {
  id: string;
  title: string;
  chapterNote: string;
  unlockComicImageUrl: string;
  weekStartDate: string;
  isPublished: boolean;
  wordIds: string[];
}

export const FALLBACK_WORDS: FallbackWord[] = [
  {
    id: "w1",
    text: "KOMIK",
    normalizedText: "KOMIK",
    difficulty: "EASY",
    clueHonest: "Buku bergambar yang menceritakan sebuah kisah lewat panel-panel cerita.",
    clueMisleading: "Koleksi gambar kue mangkok kesukaan superhero saat sarapan.",
    scheduledDate: new Date().toISOString().split("T")[0],
    category: "Literasi",
    chapterId: "ch1",
  },
  {
    id: "w2",
    text: "KLU",
    normalizedText: "KLU",
    difficulty: "EASY",
    clueHonest: "Petunjuk atau isyarat yang membantu memecahkan sebuah teka-teki.",
    clueMisleading: "Nama jenis burung langka dari kutub utara yang pandai menari.",
    scheduledDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    category: "Misteri",
    chapterId: "ch1",
  },
  {
    id: "w3",
    text: "BAYANGAN",
    normalizedText: "BAYANGAN",
    difficulty: "HARD",
    clueHonest: "Kegelapan buatan yang tercipta ketika cahaya terhalang oleh suatu benda.",
    clueMisleading: "Kucing hitam yang suka mencuri es krim di tengah malam.",
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    category: "Misteri",
    chapterId: "ch1",
  },
  {
    id: "w4",
    text: "DETEKTIF",
    normalizedText: "DETEKTIF",
    difficulty: "MEDIUM",
    clueHonest: "Seseorang yang bertugas menyelidiki kejahatan dan mencari bukti.",
    clueMisleading: "Tukang kebun yang khusus memotong rumput berbentuk karakter komik.",
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    category: "Profesi",
    chapterId: "ch1",
  },
  {
    id: "w5",
    text: "RAHASIA",
    normalizedText: "RAHASIA",
    difficulty: "MEDIUM",
    clueHonest: "Informasi sengaja disembunyikan agar tidak diketahui oleh orang lain.",
    clueMisleading: "Resep rahasia membuat bumbu mi instan yang paling gurih.",
    scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    category: "Misteri",
    chapterId: "ch1",
  },
];

export const FALLBACK_CHAPTERS: FallbackChapter[] = [
  {
    id: "ch1",
    title: "Chapter 1: Jejak Pertama Bayangan",
    chapterNote: "Kapten Klu menemukan coretan misterius di dinding kota. Apakah Bayangan meninggalkan petunjuk sengaja?",
    unlockComicImageUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
    weekStartDate: new Date().toISOString(),
    isPublished: true,
    wordIds: ["w1", "w2", "w3", "w4", "w5"],
  },
];

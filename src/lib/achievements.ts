export interface AchievementDefinition {
  id: string;
  title: string;
  category: "KATA" | "WAKTU" | "DUEL" | "TINTA" | "STREAK" | "VOICE";
  target: number;
  rewardTinta: number;
  iconEmoji: string;
  description: string;
  funnyCertificateText: string;
}

export const ACHIEVEMENTS_LIST: AchievementDefinition[] = [
  {
    id: "ach_words_1",
    title: "Penyelidik Pertama",
    category: "KATA",
    target: 1,
    rewardTinta: 15,
    iconEmoji: "🔍",
    description: "Menjawab 1 Kata Rahasia dengan Benar",
    funnyCertificateText: "Dianugerahi gelar kehormatan 'Detektif Amatir Pemegang Kaca Pembesar' karena berhasil menebak kata pertamanya tanpa membuat Kapten Klu pusing!"
  },
  {
    id: "ach_words_5",
    title: "Pengumpul Bukti",
    category: "KATA",
    target: 5,
    rewardTinta: 30,
    iconEmoji: "📂",
    description: "Menjawab 5 Kata Rahasia dengan Benar",
    funnyCertificateText: "Telah membuktikan ketajaman instingnya dengan mengoleksi 5 berkas kasus terpecahkan. Bayangan mulai merinding!"
  },
  {
    id: "ach_words_25",
    title: "Penebak Pemula",
    category: "KATA",
    target: 25,
    rewardTinta: 50,
    iconEmoji: "🥉",
    description: "Menjawab 25 Kata Rahasia dengan Benar",
    funnyCertificateText: "Dinyatakan resmi sebagai 'Detektif Kelas Menengah' oleh Kapten Klu. Keberhasilan 25 kata ini membuat Bayangan terpaksa makan biskuit melempem!"
  },
  {
    id: "ach_words_50",
    title: "Penebak Rajin",
    category: "KATA",
    target: 50,
    rewardTinta: 100,
    iconEmoji: "🥈",
    description: "Menjawab 50 Kata Rahasia dengan Benar",
    funnyCertificateText: "Tingkat ketelitian luar biasa! 50 kasus selesai. Kapten Klu bersedia meminjamkan jubah birunya selama 5 menit!"
  },
  {
    id: "ach_words_100",
    title: "Pecah Teka-Teki",
    category: "KATA",
    target: 100,
    rewardTinta: 200,
    iconEmoji: "🎖️",
    description: "Menjawab 100 Kata Rahasia dengan Benar",
    funnyCertificateText: "Kecerdasan tingkat tinggi! 100 kata berhasil dijawab. Namamu kini diukir di dinding markas utama dengan tinta komik permanen!"
  },
  {
    id: "ach_words_150",
    title: "Legenda Tekakomik",
    category: "KATA",
    target: 150,
    rewardTinta: 350,
    iconEmoji: "👑",
    description: "Menjawab 150 Kata Rahasia dengan Benar",
    funnyCertificateText: "Gelar Tertinggi: 'Detektif Legendaris Penakluk Bayangan'! Semua rahasia kota berada di genggaman kepalamu yang super encer!"
  },
  {
    id: "ach_time_15m",
    title: "Detektif Kilat",
    category: "WAKTU",
    target: 900, // 15 mins = 900s
    rewardTinta: 30,
    iconEmoji: "⏱️",
    description: "Akumulasi Waktu Bermain 15 Menit",
    funnyCertificateText: "Berhasil menatap papan kata selama 15 menit tanpa berkedip. Mata Anda dinyatakan sekuat lensa optik!"
  },
  {
    id: "ach_time_1h",
    title: "Penyelidik Jam-Jaman",
    category: "WAKTU",
    target: 3600, // 1 hour = 3600s
    rewardTinta: 120,
    iconEmoji: "⏳",
    description: "Akumulasi Waktu Bermain 1 Jam",
    funnyCertificateText: "1 jam penuh bermain Tekakomik! Konsentrasi Anda setara dengan Kapten Klu yang sedang menganalisis coretan dinding kuno!"
  },
  {
    id: "ach_time_2h",
    title: "Detektif Tanpa Lelah",
    category: "WAKTU",
    target: 7200, // 2 hours = 7200s
    rewardTinta: 250,
    iconEmoji: "🔥",
    description: "Akumulasi Waktu Bermain 2 Jam",
    funnyCertificateText: "Luar biasa! 2 jam memeras otak demi komik. Kamu berhak mendapatkan gelar 'Detektif Lembur Abadi'!"
  },
  {
    id: "ach_duel_5",
    title: "Jawara Duel",
    category: "DUEL",
    target: 5,
    rewardTinta: 60,
    iconEmoji: "⚔️",
    description: "Menyelesaikan 5 Sesi Pertandingan Duel",
    funnyCertificateText: "Telah merubuhkan harga diri 5 penantang di arena komik! Bayangan angkat topi melihat kelincahan otakmu!"
  },
  {
    id: "ach_tinta_spent_100",
    title: "Sultan Petunjuk",
    category: "TINTA",
    target: 100,
    rewardTinta: 50,
    iconEmoji: "💸",
    description: "Menggunakan Total 100 Tinta untuk Clue",
    funnyCertificateText: "Pengguna Tinta Terboros! Gelar 'Sultan Clue' resmi disematkan karena hobi memborong petunjuk Kapten Klu & Bayangan!"
  },
  {
    id: "ach_voice_10",
    title: "Detektif Vokal",
    category: "VOICE",
    target: 10,
    rewardTinta: 100,
    iconEmoji: "🎤",
    description: "Menang 10 Kali di Mode Dengar & Mic",
    funnyCertificateText: "Suaramu menembus misteri! 10 tebakan tepat lewat input Microphone. Kapten Klu merekomendasikanmu ikut audisi paduan suara detektif!"
  },
  {
    id: "ach_streak_14",
    title: "Streak Hero",
    category: "STREAK",
    target: 14,
    rewardTinta: 150,
    iconEmoji: "⚡",
    description: "Mencapai Streak Kemenangan Harian 14 Hari",
    funnyCertificateText: "Dua minggu tanpa jeda memecahkan teka-teki! Rekor 'Detektif Konsisten' yang membuat Bayangan stres tujuh keliling!"
  }
];

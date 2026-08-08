# 💥 Tekakomik — Game Tebak Kata Harian Komik Modern

**Tekakomik** adalah aplikasi web & Android (TWA / Play Store ready) game tebak kata harian bergenre **Modern Comic** yang unik, edukatif, kompetitif, dan aman. Game ini mengombinasikan keseruan tebak kata harian (Wordle-style) dengan alur cerita komik interaktif, petualangan 21 Chapter Pengetahuan Umum Nusantara & Dunia, serta mode audio/suara dan duel 1v1.

Menghadirkan 2 karakter pemandu orisinal:
- **🦸‍♂️ Kapten Klu**: Detektif superhero pemberi petunjuk **JUJUR 100%** (Identitas Warna: Electric Blue `#2B6CFF`).
- **🦹‍♀️ Bayangan**: Rival trickster pemberi petunjuk **TRICKSTER, MENYESATKAN & LUCU** (Identitas Warna: Magenta `#FF3D81`).

---

## 🎮 Cara Kerja Game (Gameplay & Fitur)

Tekakomik dirancang intuitif untuk semua kalangan dengan aturan permainan yang sederhana namun penuh tantangan:

### 1. Aturan Dasar & Arti Warna Kotak (Wordle Rules)
Pemain diberikan **6 kali kesempatan** untuk menemukan kata rahasia. Setiap tebakan memberikan umpan balik warna secara real-time:
- 🟩 **HIJAU (Benar / Correct)**: Huruf dan posisinya **100% TEPAT**.
- 🟨 **KUNING (Ada / Present)**: Huruf **ADA** di dalam kata, tetapi posisinya **SALAH**.
- ⬛ **ABU-ABU (Tidak Ada / Absent)**: Huruf **TIDAK ADA** di dalam kata rahasia.

### 2. Pilihan Mode Permainan

#### 📅 A. Mode Tebak Harian (Daily Word)
- Setiap hari tepat jam 00:00 WIB, rilis 1 kata rahasia harian baru yang siap diselidiki bersama Kapten Klu.
- Kunci jawaban tersimpan 100% aman di server cloud (Server-Side Evaluation) untuk mencegah kecurangan.

#### 📚 B. Mode Chapter Story (21 Chapter Pengetahuan Umum)
- Petualangan cerita interaktif yang terdiri dari **21 Chapter (105 Soal Pengetahuan Umum Nusantara & Dunia)** tanpa kategori misteri yang tidak relevan.
- Setiap Chapter menyajikan **Teks Narasi Story yang Panjang & Menarik** yang menceritakan perjalanan Kapten Klu mengelilingi tempat bersejarah, alam, budaya, hingga teknologi Nusantara.
- **Dual Progress Bar**: Setiap Chapter memiliki 2 indikator progres visual ber-warna identitas (🔵 **Mode Normal** & 💖 **Mode Hardcore Voice**).
- **Alur Otomatis Terurut**: Setelah menebak Kata #1 dengan benar, tombol *"Lanjut ke Kata Berikutnya (#2/5)"* otomatis membawa pemain ke kata selanjutnya secara terurut dan memperbarui jumlah kotak huruf (3 s/d 9 kotak) secara mulus.
- Membuka Panel Komik Cerita Rahasia di akhir setiap Chapter.

#### 🎙️ C. Mode Dengar & Mic (Hardcore Voice Mode)
- Tantangan waktu **120 Detik (Countdown Timer)**!
- Petunjuk diputar via audio suara (*Web Speech API*) dan pemain dapat menebak kata langsung menggunakan suara melalui tombol **Microphone**. Pemutaran suara dilengkapi tombol fallback teks untuk iOS Safari.

#### ⚔️ D. Mode Duel 1v1 (Asinkron)
- Pemain bisa menantang teman untuk menebak kata yang SAMA dengan batas waktu 120 detik.
- Cukup bagikan kode room 6 digit via WhatsApp/Medsos, lalu hasil perbandingan akhir ditampilkan bersandingan dalam **2 Panel Komik**.

#### 📴 E. Mode Offline Story (Tanpa Internet / Play Store Ready)
- Pemain dapat tetap memainkan 21 Chapter Story tanpa koneksi internet (Airplane Mode).
- Evaluasi tebakan diproses secara lokal di HP pemain (*Client-Side Evaluator*) dan halaman di-cache secara permanen melalui **PWA Service Worker** (`/sw.js`).

---

## 🏆 Poin Akumulatif & Sistem Papan Peringkat (Leaderboard)

1. **Poin Akumulatif (Accumulated Score)**:
   - Skor di Papan Peringkat (`/leaderboard`) dihitung dari **total penjumlahan seluruh skor kata yang berhasil dipecahkan** oleh pengguna.
   - Peringkat ditentukan berdasarkan Total Poin tertinggi, jumlah kata terpecahkan, dan rata-rata percobaan.
2. **Formula Skor Komik (*Comic Score*)**:
   - **Base Skor**: 100 Poin
   - **Penalti Percobaan**: -15 Poin tiap percobaan tambahan
   - **Penalti Petunjuk**: -10 Poin jika memakai clue
   - **Bonus Kecepatan**: Bonus hingga +15 Poin jika selesai di bawah 30 detik
   - **Bonus Mode Dengar**: +25 Poin untuk Hardcore Voice Mode
3. **Currency Tinta Komik**:
   - Diberikan saat menang tebakan, menjaga *Streak* login harian (+70 Tinta/hari), dan menyelesaikan Chapter.
   - Digunakan untuk menukar bantuan petunjuk Kapten Klu (10 Tinta), Bayangan (5 Tinta), Buka Dua-duanya (12 Tinta), atau Buka 1 Huruf Rahasia (15 Tinta).
   - Pengguna dapat membeli **beberapa bantuan petunjuk secara berurutan** (*Sequential Multi-Clue Purchase*).

---

## 🎨 Visual Identity & Tech Stack

### Frontend & UI Architecture
- **Framework**: Next.js 16 (App Router, React 19, Turbopack, Server Components & Server Actions)
- **Styling Engine**: Tailwind CSS v4 (`@theme`, custom comic borders, halftone dot patterns, hard sticker shadows)
- **Design Language**: Modern Comic Style (Border tebal 3px `#16161A`, offset shadow keras `4px 4px 0 #16161A`, zero AI-slop)
- **Logo Brand**: Logo "TK" Komik Modern dengan huruf **K** miring yang seolah-olah jatuh terkena gaya gravitasi.
- **Typography**: `Bangers` / `Archivo Black` (Judul, Angka, & Display), `Plus Jakarta Sans` (Body text & Label)
- **Animations**: Framer Motion (3D Card Flip, Comic Shake, Burst Pop, 3D Floating Emojis, Auto-Filling Wordle Grid Simulation)
- **Export & Sharing**: `html-to-image` untuk mengunduh sertifikat & kartu hasil tebakan.

### Backend, Database & Security
- **Database**: PostgreSQL (Hosted on Neon.tech)
- **ORM & Driver**: Prisma ORM v7 dengan `@prisma/adapter-pg` driver pooler
- **Authentication**: NextAuth v5 (Google OAuth + Credentials + Anonymous Guest Storage)
- **PWA & Android TWA**: Web App Manifest (`manifest.webmanifest`), Digital Asset Links (`assetlinks.json`), dan Service Worker (`public/sw.js`).
- **Middleware / Proxy**: Next.js 16 `proxy.ts` (Strict NextAuth JWT Auth Guard)

---

## 🔒 Arsitektur Keamanan (Security & Anti-Cheat)

1. **Zero Text Leak (Evaluasi Server-Side)**:
   - String `Word.text` **TIDAK PERNAH** dikirimkan ke client/browser sebelum pemain menyelesaikan tebakan hari itu.
   - Evaluasi huruf dilakukan 100% di server (`/api/game/guess`).
2. **Keamanan Kredensial & Secrets**:
   - Password di-hash permanen menggunakan `bcryptjs`.
   - Seluruh kredensial rahasia (`DATABASE_URL`, `AUTH_SECRET`, Google OAuth) disimpan dalam `.env` dan diabaikan di `.gitignore`.
3. **Perlindungan Keystore Android & TWA Build**:
   - File `.keystore`, `.aab`, `.apk`, `.zip`, dan artifact build Android secara ketat didaftarkan di `.gitignore` untuk mencegah kebocoran kunci di GitHub.

---

## 🚀 Cara Menginstal & Memulai Proyek Lokal

```bash
# 1. Clone repository
git clone https://github.com/bayy-kim/ketakomik.git
cd tekakomik

# 2. Install dependencies
npm install

# 3. Buat file .env dan isi DATABASE_URL & NEXTAUTH_SECRET

# 4. Generate Prisma Client & Push Schema
npx prisma generate
npx prisma db push

# 5. Jalankan Seeding Data 21 Chapter Pengetahuan Umum
npx ts-node prisma/seed.ts

# 6. Jalankan server pengembangan
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

---

## 📱 Siap Upload ke Google Play Store (TWA / AAB)

Proyek ini telah dilengkapi:
- File `public/.well-known/assetlinks.json` dengan SHA-256 fingerprint resmi.
- Halaman Kebijakan Privasi (`/privacy`).
- File `Tekakomik.aab` yang telah disetujui oleh PWABuilder.

---

## 📜 Lisensi

Project ini dilindungi di bawah lisensi [MIT License](LICENSE).

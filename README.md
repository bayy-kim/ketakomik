# 💥 Tekakonik (Ketakomik)

**Tekakonik** adalah aplikasi web game tebak kata harian bergenre **Modern Comic** dengan 2 karakter pemandu orisinal:
- **Kapten Klu**: Detektif superhero pemberi petunjuk **JUJUR** (Warna identitas: Electric Blue `#2B6CFF`).
- **Bayangan**: Rival trickster pemberi petunjuk **LUCU/MENYESATKAN** (Warna identitas: Magenta `#FF3D81`).

---

## 🎨 Visual Identity & Tech Stack

- **Framework**: Next.js 15+ (App Router, Server Actions, TypeScript strict mode)
- **Styling**: Tailwind CSS v4 (`@theme`, custom comic borders, halftone patterns, sticker shadows)
- **Fonts**: `Bangers` / `Archivo Black` (Judul & Display), `Plus Jakarta Sans` (Body text)
- **Database & Auth**: Prisma ORM + PostgreSQL (Neon) & NextAuth v5 (Credential + Google OAuth + Anonymous Guest session)
- **Animations**: Framer Motion (3D Card Flip, Comic Shake, Burst Pop)
- **Media & Charts**: Vercel Blob (Comic Panels) & Recharts (Dashboard Analytics)
- **Export**: `html-to-image` untuk menyimpan panel komik hasil tebakan & WhatsApp Share (`wa.me`)

---

## 🎮 Gameplay Features

1. **Tebak Kata Harian**: 6 kesempatan tebak kata (4–8 huruf) dengan masukan status warna (Hijau = Benar, Kuning = Misplaced, Abu = Tidak Ada).
2. **Dual Clue System**: Minta bantuan Kapten Klu (jujur) atau Bayangan (trik) menggunakan currency **Tinta**.
3. **Mode Dengar (Hardcore Voice)**: Sembunyikan teks clue dan putar ucapan karakter via **Web Speech API** (`SpeechSynthesisUtterance`) lengkap dengan fallback teks untuk iOS Safari.
4. **Story Chapter Mingguan**: Kumpulkan progres 5-7 kata per chapter untuk membuka *Comic Panel Reveal* rilis cerita orisinal.
5. **Mode Duel Asinkron**: Buat kode room 6 karakter untuk menantang teman dan bandingkan hasil dalam 2 Panel Komik Bersebelahan.
6. **Papan Peringkat (Leaderboard)**: Filter Mode Normal vs Mode Dengar (Harian, Mingguan, Sepanjang Masa).
7. **Usulkan Kata Komunitas**: Pengguna bisa mengirim usulan kata untuk ditinjau oleh Admin.
8. **Admin Panel Complete**:
   - `/admin/words` — Manage Words & jadwal rilis.
   - `/admin/chapters` — Manage Chapters & Upload komik unlock via Vercel Blob.
   - `/admin/analytics` — Dashboard Recharts & Auto-difficulty balancer (`TOO_EASY` / `TOO_HARD`).
   - `/admin/suggestions` — Moderasi usulan kata komunitas (ACC / Tolak).
   - `/admin/announcements` — Manage banner pengumuman aktif.
   - `/admin/flags` — Toggle Feature Flags.

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/bayy-kim/ketakomik.git
cd ketakomik
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tekakomik"
NEXTAUTH_SECRET="your-nextauth-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 4. Setup Prisma Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔒 Security Principles

- Jawaban kata (`Word.text`) **TIDAK PERNAH** dikirim ke client frontend sebelum sesi tebakan selesai.
- Evaluasi tebakan 100% diproses server-side pada route `/api/game/guess`.
- Seluruh rute `/admin` & `/api/admin/*` dilindungi middleware berbasis role `ADMIN`.

---

## 📜 License

Project ini dilindungi di bawah lisensi [MIT License](LICENSE).

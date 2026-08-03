# 💥 Tekakonik (Ketakomik)

**Tekakonik** adalah aplikasi web game tebak kata harian bergenre **Modern Comic** yang unik, kompetitif, dan aman. Menghadirkan 2 karakter pemandu orisinal:
- **Kapten Klu**: Detektif superhero pemberi petunjuk **JUJUR 100%** (Electric Blue `#2B6CFF`).
- **Bayangan**: Rival trickster pemberi petunjuk **TRICKSTER & LUCU** (Magenta `#FF3D81`).

---

## 🎨 Visual Identity & Tech Stack

### Frontend & UI Architecture
- **Framework**: Next.js 15+ (App Router, React 19, Server Components & Server Actions)
- **Styling Engine**: Tailwind CSS v4 (`@theme`, custom comic borders, halftone patterns, sticker shadows)
- **Design Language**: Modern Comic Style (Thick 3px ink borders, hard offset shadows, zero AI-slop)
- **Typography**: `Bangers` / `Archivo Black` (Judul & Display), `Plus Jakarta Sans` (Body text)
- **Animations**: Framer Motion (3D Card Flip, Comic Shake, Burst Pop, 3D Floating Emojis, Auto-Filling Wordle Grid Simulation)
- **Charts & Media**: Recharts (Admin Analytics) & Vercel Blob (Unlockable Comic Chapter Panels)
- **Sharing & Image Export**: `html-to-image` untuk mengunduh panel komik hasil tebakan & WhatsApp Share (`wa.me`)

### Backend, Database & Security
- **Database**: PostgreSQL (Hosted on Neon.tech)
- **ORM & Driver**: Prisma ORM v7 dengan `@prisma/adapter-pg` driver pooler
- **Authentication**: NextAuth v5 (Google OAuth + Credentials + Anonymous Guest Storage)
- **Password Security**: `bcryptjs` (salt rounds 10, no plaintext passwords)
- **Middleware Security**: Strict NextAuth JWT Middleware (`secureCookie: true`)

---

## 🔒 Arsitektur Keamanan (Anti-Hacker & Security Audit)

1. **Zero Text Leak (Evaluasi Server-Side)**:
   - String `Word.text` **TIDAK PERNAH** dikirimkan ke client/browser sebelum pemain menyelesaikan tebakan hari itu.
   - Evaluasi huruf (Hijau, Kuning, Abu-abu) 100% dilakukan di server (`/api/game/guess`).

2. **Keamanan Kredensial Database**:
   - Password di database di-hash secara permanen dengan `bcryptjs`.
   - File `.env` tidak pernah dikomituskan ke Git (didaftarkan di `.gitignore`).

3. **Perlindungan Admin Panel (`/admin` & `/loginadmin`)**:
   - Rute `/admin` dan `/api/admin/*` dilindungi middleware yang mengecek role `ADMIN` di JWT token.
   - Akses non-admin akan menerima `403 Forbidden` tanpa membocorkan struktur internal admin.
   - Rute login admin rahasia di `/loginadmin` tidak ditampilkan di menu publik.

---

## 🎮 Keunikan Gameplay & Sistem Skor Komik (*Comic Score*)

1. **Aturan 1 Soal Per Hari**: Setelah menyelesaikan soal hari ini, soal terkunci dan pemain diarahkan ke **Story Chapters** atau **Mode Duel**.
2. **Formula Skor Komik (*Comic Score*)**:
   - Base Skor: **100 Poin**
   - Penalti Percobaan: **-15 Poin** setiap percobaan tambahan
   - Penalti Petunjuk: **-10 Poin** jika membuka petunjuk
   - Bonus Kecepatan: Bonus hingga **+15 Poin** jika selesai di bawah 30 detik
   - Bonus Mode Dengar: **+25 Poin** untuk Hardcore Voice Mode
3. **Dual Clue System**: Speech bubble Kapten Klu (jujur) vs Bayangan (trik) menggunakan currency **Tinta**.
4. **Mode Dengar (Hardcore Voice)**: Pemutaran petunjuk audio via Web Speech API (`SpeechSynthesisUtterance`) dengan fallback teks untuk iOS Safari.
5. **Mode Duel Asinkron**: Tantang teman menebak kata yang sama via kode room 6 digit dengan tampilan perbandingan 2 Panel Komik Bersebelahan.

---

## 🚀 Instalasi & Memulai Proyek

```bash
# 1. Clone repository
git clone https://github.com/bayy-kim/ketakomik.git
cd ketakomik

# 2. Install dependencies
npm install

# 3. Jalankan Prisma migration/sync
npx prisma generate
npx prisma db push

# 4. Jalankan development server
npm run dev
```

---

## 📜 Lisensi

Project ini dilindungi di bawah lisensi [MIT License](LICENSE).

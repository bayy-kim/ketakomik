import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - Tekakomik",
  description: "Kebijakan Privasi penggunaan aplikasi Tekakomik dan perlindungan data pengguna.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-8">
        {/* Header Banner */}
        <div className="bg-comic-yellow comic-border p-5 rounded-xl comic-shadow mb-8 rotate-[-1deg] flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-comic-ink shrink-0" />
          <div>
            <h1 className="font-bangers text-3xl sm:text-4xl text-comic-ink leading-none">
              KEBIJAKAN PRIVASI (PRIVACY POLICY)
            </h1>
            <p className="text-xs sm:text-sm font-sans text-comic-ink mt-1">
              Terakhir diperbarui: 7 Agustus 2026 • Komitmen perlindungan data pemain Tekakomik
            </p>
          </div>
        </div>

        <div className="bg-white comic-border p-6 sm:p-8 rounded-xl comic-shadow space-y-6 text-comic-ink font-sans text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-klu flex items-center gap-2 border-b-2 border-comic-ink pb-1">
              <Eye className="w-5 h-5" /> 1. Pendahuluan
            </h2>
            <p>
              Selamat datang di <strong>Tekakomik</strong> (&ldquo;Kami&rdquo;). Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi pemain kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda saat menggunakan aplikasi web dan Android TWA Tekakomik.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-klu flex items-center gap-2 border-b-2 border-comic-ink pb-1">
              <FileText className="w-5 h-5" /> 2. Data yang Kami Kumpulkan
            </h2>
            <p>Kami mengumpulkan beberapa jenis informasi untuk memberikan pengalaman bermain game yang optimal:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              <li><strong>Informasi Akun:</strong> Alamat email, nama pengguna (username), dan foto profil (avatar) yang Anda berikan saat mendaftar atau masuk melalui Google OAuth / NextAuth.</li>
              <li><strong>Data Permainan:</strong> Riwayat tebakan kata, skor komik, jumlah Tinta Komik, statistik streak harian, dan pencapaian (achievements).</li>
              <li><strong>Data Teknis:</strong> Informasi perangkat dasar, alamat IP, dan log sesi yang digunakan untuk keamanan dan analitik aplikasi.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-klu flex items-center gap-2 border-b-2 border-comic-ink pb-1">
              <UserCheck className="w-5 h-5" /> 3. Penggunaan Informasi
            </h2>
            <p>Informasi yang dikumpulkan digunakan semata-mata untuk:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              <li>Menyediakan dan mengelola sesi permainan tebak kata harian dan mode duel.</li>
              <li>Menampilkan papan peringkat (Leaderboard) publik (pengguna yang ditangguhkan/diban akan disembunyikan).</li>
              <li>Menyimpan progres Chapter Story dan klaim hadiah Tinta harian.</li>
              <li>Meningkatkan kualitas dan keamanan layanan permainan.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-klu flex items-center gap-2 border-b-2 border-comic-ink pb-1">
              <Lock className="w-5 h-5" /> 4. Keamanan & Penyimpanan Data
            </h2>
            <p>
              Kata kunci (password) Anda disimpan menggunakan enkripsi hash aman (Bcrypt). Kami menerapkan praktik keamanan standar industri dan tidak akan pernah menjual atau membagikan data pribadi Anda kepada pihak ketiga tanpa izin Anda.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="font-bangers text-xl sm:text-2xl text-comic-klu flex items-center gap-2 border-b-2 border-comic-ink pb-1">
              <RefreshCw className="w-5 h-5" /> 5. Hak Pengguna & Penghapusan Akun
            </h2>
            <p>
              Anda berhak mengakses, memperbarui profil, atau meminta penghapusan akun beserta seluruh data riwayat permainan Anda. Untuk mengajukan permintaan penghapusan data, Anda dapat menghubungi tim kami melalui formulir usulan atau email dukungan.
            </p>
          </section>

          {/* Back Button */}
          <div className="pt-4 border-t-2 border-dashed border-gray-300 flex justify-center">
            <Link
              href="/"
              className="comic-btn bg-comic-yellow text-comic-ink hover:bg-yellow-400 text-sm px-6 py-2.5"
            >
              KEMBALI KE BERANDA
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("Token reset password tidak ditemukan di URL!");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Token tidak valid!");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password baru minimal 6 karakter!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi password baru tidak cocok!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal meng-update password baru.");
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message || "Password berhasil diperbarui!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-2xl comic-shadow-lg w-full flex flex-col gap-5">
          <div className="bg-comic-klu comic-border p-3.5 rounded-xl text-white flex items-center gap-3 rotate-[-1deg]">
            <ShieldCheck className="w-8 h-8 text-comic-yellow shrink-0" />
            <div>
              <h1 className="font-bangers text-2xl sm:text-3xl">PERBAIKI KATA SANDI</h1>
              <p className="text-xs font-sans text-blue-100">
                Buat kata sandi baru untuk mengamankan akun Tekakonik kamu.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-100 comic-border-sm p-2.5 rounded text-xs font-bold text-red-600">
              {errorMsg}
            </div>
          )}

          {successMsg ? (
            <div className="bg-green-50 comic-border p-5 rounded-xl text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
              <h2 className="font-bangers text-2xl text-comic-ink">BERHASIL!</h2>
              <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                {successMsg}
              </p>
              <Link
                href="/auth/login"
                className="comic-btn text-sm bg-comic-yellow text-comic-ink hover:bg-yellow-400 mt-2"
              >
                Sign In Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
                  <Lock className="w-4 h-4 text-comic-klu" /> KATA SANDI BARU:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 Karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
                  <Lock className="w-4 h-4 text-comic-klu" /> KONFIRMASI KATA SANDI BARU:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-2.5 mt-2"
              >
                {loading ? "Menyimpan..." : "SIMPAN KATA SANDI BARU"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bangers text-2xl">MEMUAT FORM RESET...</div>}>
      <ResetPasswordContainer />
    </Suspense>
  );
}

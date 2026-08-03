"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LupaKataSandiPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [demoResetUrl, setDemoResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Masukkan alamat email yang valid!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setDemoResetUrl(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal memproses permintaan reset password.");
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message || "Link reset password telah dikirim ke email Anda!");
      if (data.demoResetUrl) {
        setDemoResetUrl(data.demoResetUrl);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah saat mengirim permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-2xl comic-shadow-lg w-full flex flex-col gap-5">
          <div className="bg-comic-yellow comic-border p-3.5 rounded-xl text-comic-ink flex items-center gap-3 rotate-[-1deg]">
            <Mail className="w-8 h-8 text-comic-ink shrink-0" />
            <div>
              <h1 className="font-bangers text-2xl sm:text-3xl">LUPA KATA SANDI?</h1>
              <p className="text-xs font-sans text-gray-800">
                Masukkan email terdaftar kamu untuk menerima link perbaikan password.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-100 comic-border-sm p-2.5 rounded text-xs font-bold text-red-600">
              {errorMsg}
            </div>
          )}

          {successMsg ? (
            <div className="bg-green-50 comic-border p-4 rounded-xl text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
              <p className="font-sans text-xs sm:text-sm text-gray-800 leading-relaxed">
                {successMsg}
              </p>

              {demoResetUrl && (
                <div className="w-full bg-yellow-100 comic-border-sm p-2 rounded text-[11px] font-mono break-all text-left">
                  <span className="font-bold text-comic-ink block mb-1">Dev Quick Link:</span>
                  <a href={demoResetUrl} className="text-comic-klu underline">
                    {demoResetUrl}
                  </a>
                </div>
              )}

              <Link
                href="/auth/login"
                className="comic-btn text-sm bg-comic-klu text-white hover:bg-blue-600 mt-2"
              >
                Kembali ke Halaman Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
                  <Mail className="w-4 h-4 text-comic-klu" /> ALAMAT EMAIL TERDAFTAR:
                </label>
                <input
                  type="email"
                  required
                  placeholder="detektif@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-2.5 mt-1"
              >
                <Send className="w-4 h-4" /> {loading ? "Mengirim Email..." : "KIRIM LINK RESET PASSWORD"}
              </button>
            </form>
          )}

          <div className="border-t-2 border-gray-200 pt-3 text-center">
            <Link
              href="/auth/login"
              className="text-xs font-bangers text-comic-klu hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

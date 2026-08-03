"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lock, ShieldAlert, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Kredensial Admin tidak valid!");
        setLoading(false);
      } else {
        // Redirect to admin dashboard after successful admin login
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Akses ditolak atau kesalahan autentikasi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />

      <main className="flex-1 max-w-md mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-2xl comic-shadow-lg w-full flex flex-col gap-5">
          {/* Secret Admin Banner */}
          <div className="bg-comic-ink comic-border p-3.5 rounded-xl text-white flex items-center gap-3 rotate-[-1deg]">
            <ShieldAlert className="w-8 h-8 text-comic-yellow shrink-0" />
            <div>
              <h1 className="font-bangers text-2xl sm:text-3xl text-comic-yellow">MARKAS KAPTEN KLU / ADMIN</h1>
              <p className="text-xs font-sans text-gray-300">
                Akses Terbatas: Hanya untuk Pengelola Resmi Tekakonik.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-100 comic-border-sm p-2.5 rounded text-xs font-bold text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
                USERNAME ADMIN / EMAIL:
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
                <Lock className="w-4 h-4 text-comic-ink" /> PASSWORD ADMIN:
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-2.5 mt-2"
            >
              <LogIn className="w-4 h-4" /> {loading ? "Verifikasi Akses..." : "MASUK KE ADMIN PANEL"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

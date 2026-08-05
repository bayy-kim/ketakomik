"use client";

import { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { User, Lock, LogIn, Mail, UserPlus, ShieldAlert, Sparkles, HelpCircle, Timer } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthContainer() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chapter";

  const [tab, setTab] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Countdown timer for temporary ban
  const [suspendTimeLeft, setSuspendTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (suspendTimeLeft !== null && suspendTimeLeft > 0) {
      interval = setInterval(() => {
        setSuspendTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(interval!);
            setErrorMsg("");
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [suspendTimeLeft]);

  // Handle errors from URL params (e.g. Google OAuth redirect on ban)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const untilParam = searchParams.get("until");
    const reasonParam = searchParams.get("reason");

    if (errorParam === "Banned" || errorParam === "OAuthSignin" || errorParam === "Callback") {
      if (untilParam) {
        if (untilParam === "permanen") {
          setErrorMsg(`⛔ AKUN ANDA DIBEKUKAN PERMANEN OLEH ADMIN! Alasan: ${reasonParam || "Pelanggaran aturan"}`);
        } else {
          const expireTime = new Date(untilParam).getTime();
          const diffSeconds = Math.max(0, Math.round((expireTime - Date.now()) / 1000));
          if (diffSeconds > 0) {
            setSuspendTimeLeft(diffSeconds);
            setErrorMsg(`⏳ AKUN ANDA SEDANG DI-SUSPEND SEMENTARA! Alasan: ${reasonParam || "Pelanggaran aturan"}`);
          }
        }
      }
    }
  }, [searchParams]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setSuspendTimeLeft(null);

    try {
      const res = await signIn("credentials", {
        username: loginUsername,
        password: loginPassword,
        redirect: false,
      });

      // Handle custom errors thrown from authorize callback
      if (res?.error) {
        if (res.error.includes("SUSPENDED")) {
          // Format: SUSPENDED:untilTime:reason
          const parts = res.error.split(":");
          const until = parts[2] + ":" + parts[3] + ":" + parts[4]; // Rebuild ISO String
          const reason = parts[5] || "Pelanggaran aturan komunitas";

          if (until === "permanen" || until.includes("permanen")) {
            setErrorMsg(`⛔ AKUN ANDA DIBEKUKAN PERMANEN OLEH ADMIN! Alasan: ${reason}`);
          } else {
            const expireTime = new Date(until).getTime();
            const diffSeconds = Math.max(0, Math.round((expireTime - Date.now()) / 1000));
            if (diffSeconds > 0) {
              setSuspendTimeLeft(diffSeconds);
              setErrorMsg(`⏳ AKUN ANDA SEDANG DI-SUSPEND SEMENTARA! Alasan: ${reason}`);
            } else {
              setErrorMsg("Gagal melakukan login. Silakan coba lagi.");
            }
          }
        } else {
          setErrorMsg("Username atau password salah!");
        }
        setLoading(false);
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal melakukan Sign In");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mendaftarkan akun");
        setLoading(false);
        return;
      }

      // Automatically sign in the newly registered user
      const loginRes = await signIn("credentials", {
        username: regUsername,
        password: regPassword,
        redirect: false,
      });

      if (!loginRes?.error) {
        window.location.href = callbackUrl;
      } else {
        setSuccessMsg("Pendaftaran berhasil! Silakan Sign In dengan akun baru Anda.");
        setTab("login");
        setLoginUsername(regUsername);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi bermasalah saat mendaftar");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  const formatCountdown = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let res = "";
    if (days > 0) res += `${days} Hari `;
    res += `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return res;
  };

  return (
    <div className="bg-white comic-border p-6 rounded-xl comic-shadow-lg w-full flex flex-col gap-5">
      {/* Comic Header Banner */}
      <div className="bg-comic-klu comic-border p-3.5 rounded-xl text-white flex items-center gap-3 rotate-[-1deg]">
        <ShieldAlert className="w-8 h-8 text-comic-yellow shrink-0" />
        <div>
          <h1 className="font-bangers text-2xl sm:text-3xl">AKUN TEKAKOMIK</h1>
          <p className="text-xs font-sans">
            Simpan streak permanen, kumpulkan Tinta, dan ikuti Mode Duel!
          </p>
        </div>
      </div>

      {/* Tab Switcher: SIGN IN vs DAFTAR */}
      <div className="flex gap-2 bg-gray-100 comic-border-sm p-1 rounded-xl">
        <button
          onClick={() => {
            setTab("login");
            setErrorMsg("");
            setSuccessMsg("");
            setSuspendTimeLeft(null);
          }}
          className={`flex-1 py-2 font-bangers text-base rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === "login"
              ? "bg-comic-yellow text-comic-ink comic-border-sm comic-shadow-sm"
              : "text-gray-600 hover:text-comic-ink"
          }`}
        >
          <LogIn className="w-4 h-4" /> SIGN IN
        </button>

        <button
          onClick={() => {
            setTab("register");
            setErrorMsg("");
            setSuccessMsg("");
            setSuspendTimeLeft(null);
          }}
          className={`flex-1 py-2 font-bangers text-base rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === "register"
              ? "bg-comic-bayangan text-white comic-border-sm comic-shadow-sm"
              : "text-gray-600 hover:text-comic-ink"
          }`}
        >
          <UserPlus className="w-4 h-4" /> DAFTAR BARU
        </button>
      </div>

      {/* Google 1-Click OAuth Login */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="comic-btn text-base bg-white hover:bg-gray-100 text-comic-ink w-full py-2.5 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
          />
        </svg>
        <span>SIGN IN DENGAN GOOGLE</span>
      </button>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-0.5 bg-comic-ink" />
        <span className="font-bangers text-sm text-gray-500">ATAU PAKAI FORM</span>
        <div className="flex-1 h-0.5 bg-comic-ink" />
      </div>

      {errorMsg && (
        <div className="bg-red-100 comic-border-sm p-3 rounded text-xs font-bold text-red-600 flex flex-col gap-1.5 items-center">
          <span>{errorMsg}</span>
          {suspendTimeLeft !== null && (
            <div className="bg-white border border-red-400 text-red-600 px-3 py-1 rounded-md font-bangers text-sm flex items-center gap-1">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>SISA WAKTU: {formatCountdown(suspendTimeLeft)}</span>
            </div>
          )}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 comic-border-sm p-2.5 rounded text-xs font-bold text-emerald-700">
          {successMsg}
        </div>
      )}

      {/* Form Login */}
      {tab === "login" ? (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
              <User className="w-4 h-4 text-comic-klu" /> USERNAME / EMAIL:
            </label>
            <input
              type="text"
              required
              placeholder="emailkamu@gmail.com"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
                <Lock className="w-4 h-4 text-comic-klu" /> PASSWORD:
              </label>
              <Link
                href="/lupakatasandi"
                className="text-xs font-sans text-comic-klu font-bold hover:underline flex items-center gap-0.5"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Lupa Kata Sandi?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn text-base bg-comic-yellow hover:bg-yellow-400 text-comic-ink w-full py-2.5 mt-2"
          >
            <LogIn className="w-4 h-4" /> {loading ? "Memproses..." : "SIGN IN KE TEKAKOMIK"}
          </button>
        </form>
      ) : (
        /* Form Pendaftaran */
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
              <User className="w-4 h-4 text-comic-bayangan" /> USERNAME BARU:
            </label>
            <input
              type="text"
              required
              placeholder="DetektifKata"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
              <Mail className="w-4 h-4 text-comic-bayangan" /> ALAMAT EMAIL:
            </label>
            <input
              type="email"
              required
              placeholder="detektif@example.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bangers text-base text-comic-ink flex items-center gap-1">
              <Lock className="w-4 h-4 text-comic-bayangan" /> PASSWORD:
            </label>
            <input
              type="password"
              required
              placeholder="Minimal 6 Karakter"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-sm text-comic-ink"
            />
          </div>

          <div className="bg-amber-50 comic-border-sm p-2 rounded flex items-center gap-1.5 text-xs text-comic-ink font-bold">
            <Sparkles className="w-4 h-4 text-comic-yellow fill-comic-yellow shrink-0" />
            <span>Bonus Pendaftaran: +100 Tinta Gratis!</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn text-base bg-comic-bayangan hover:bg-pink-600 text-white w-full py-2.5 mt-1"
          >
            <UserPlus className="w-4 h-4" /> {loading ? "Mendaftarkan..." : "BUAT AKUN BARU"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-comic-paper">
      <Header />
      <main className="flex-1 max-w-md mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <Suspense fallback={<div className="p-8 text-center font-bangers text-2xl text-comic-ink">MEMUAT LAYAR SIGN IN...</div>}>
          <AuthContainer />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

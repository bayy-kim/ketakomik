"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UsulKataPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || text.trim().length < 3 || text.trim().length > 10) {
      setErrorMsg("Kata harus berukuran 3 - 10 huruf!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/usul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), note: note.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengusulkan kata");
        return;
      }

      setSubmitted(true);
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

      <main className="flex-1 max-w-xl mx-auto w-full px-3 py-8 flex flex-col items-center justify-center">
        <div className="bg-white comic-border p-6 rounded-2xl comic-shadow-lg w-full flex flex-col gap-6">
          {/* Header Banner */}
          <div className="bg-emerald-500 comic-border p-3.5 rounded-xl text-white flex items-center justify-between gap-3 rotate-[-1deg]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-comic-yellow shrink-0" />
              <div>
                <h1 className="font-bangers text-2xl sm:text-3xl">USULKAN KATA KOMUNITAS</h1>
                <p className="text-xs font-sans">
                  Punya kata menarik untuk Kapten Klu atau Bayangan? Kirimkan ke admin!
                </p>
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/dashboardadmin/suggestions"
                className="comic-btn text-xs bg-white text-comic-ink hover:bg-gray-100 shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Moderasi
              </Link>
            )}
          </div>

          {submitted ? (
            <div className="bg-green-50 comic-border p-6 rounded-xl text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
              <h2 className="font-bangers text-2xl text-comic-ink">USULAN BERHASIL TERKIRIM!</h2>
              <p className="text-xs sm:text-sm text-gray-700 font-sans">
                Kata usulanmu sedang ditinjau oleh Admin. Terima kasih sudah membantu petualangan Kapten Klu!
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setText("");
                  setNote("");
                }}
                className="comic-btn text-sm bg-comic-yellow text-comic-ink mt-2"
              >
                Kirim Usulan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-100 comic-border-sm p-2 rounded text-xs font-bold text-red-600">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-base text-comic-ink">KATA USULAN (3-10 HURUF):</label>
                <input
                  type="text"
                  required
                  placeholder="CONTOH: KOMIK"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="bg-gray-50 comic-border px-3 py-2 rounded font-bangers text-2xl text-comic-ink uppercase tracking-widest"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bangers text-base text-comic-ink">CATATAN / CONTOH CLUE (OPSIONAL):</label>
                <textarea
                  rows={3}
                  placeholder="Contoh clue jujur Kapten Klu atau clue lucu Bayangan..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-gray-50 comic-border p-3 rounded font-sans text-sm text-comic-ink"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="comic-btn text-base bg-emerald-500 hover:bg-emerald-600 text-white w-full py-3"
              >
                <Send className="w-4 h-4" /> {loading ? "Mengirim..." : "KIRIM USULAN KATA"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

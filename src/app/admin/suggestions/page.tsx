"use client";

import { useState, useEffect } from "react";
import { MessageSquarePlus, Check, X } from "lucide-react";

interface SuggestionItem {
  id: string;
  text: string;
  note: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedByUser?: { username: string };
  createdAt: string;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/suggestions");
      const data = await res.json();
      if (data.suggestions) setSuggestions(data.suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId: id, status }),
      });
      if (res.ok) {
        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink">MODERASI USULAN KATA KOMUNITAS</h1>
        <p className="text-xs font-sans text-gray-700">
          Tinjau kata-kata yang diusulkan oleh para pemain dan jadikan kata harian resmi.
        </p>
      </div>

      <div className="bg-white comic-border p-5 rounded-xl comic-shadow">
        {loading ? (
          <div className="p-8 text-center font-bangers text-2xl text-comic-ink">MEMUAT USULAN...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {suggestions.map((s) => (
              <div key={s.id} className="comic-border p-3.5 rounded-lg flex items-center justify-between bg-gray-50">
                <div>
                  <span className="font-bangers text-xl text-comic-klu">{s.text}</span>
                  {s.note && <p className="text-xs font-sans text-gray-600 italic">&ldquo;{s.note}&rdquo;</p>}
                  <span className="text-[10px] text-gray-400 font-sans">
                    Pengirim: {s.submittedByUser?.username || "Guest"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {s.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(s.id, "APPROVED")}
                        className="comic-btn text-xs bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-2.5"
                      >
                        <Check className="w-4 h-4" /> ACC
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(s.id, "REJECTED")}
                        className="comic-btn text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2.5"
                      >
                        <X className="w-4 h-4" /> TOLAK
                      </button>
                    </>
                  ) : (
                    <span
                      className={`font-bangers text-xs px-2.5 py-1 rounded comic-border-sm text-white ${
                        s.status === "APPROVED" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

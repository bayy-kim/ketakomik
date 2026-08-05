"use client";

import { useState, useEffect } from "react";
import { User, ShieldAlert, Ban, ShieldCheck, Search, ShieldX, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserItem {
  id: string;
  username: string;
  email: string;
  role: string;
  isBanned: boolean;
  banReason: string | null;
  bannedUntil: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");
  const [isTemporary, setIsTemporary] = useState(false);
  const [bannedUntil, setBannedUntil] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBan = async (userId: string, currentBanned: boolean) => {
    if (!currentBanned) {
      // Open modal to get ban reason & time
      setActionUserId(userId);
      setBanReason("");
      setIsTemporary(false);
      setBannedUntil("");
      setShowBanModal(true);
      return;
    }

    // Unban directly
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isBanned: false }),
      });
      if (res.ok) {
        loadUsers();
      } else {
        alert("Gagal memproses unban!");
      }
    } catch (e) {
      console.error(e);
      alert("Koneksi bermasalah!");
    }
  };

  const submitBanAction = async () => {
    if (!actionUserId) return;
    if (isTemporary && !bannedUntil) {
      alert("Pilih tanggal batas waktu suspend!");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: actionUserId,
          isBanned: true,
          banReason: banReason.trim() || "Akun dinonaktifkan oleh administrator",
          bannedUntil: isTemporary ? new Date(bannedUntil).toISOString() : null,
        }),
      });
      if (res.ok) {
        setShowBanModal(false);
        setActionUserId(null);
        loadUsers();
      } else {
        alert("Gagal memproses ban!");
      }
    } catch (e) {
      console.error(e);
      alert("Koneksi bermasalah!");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="bg-white comic-border p-4 rounded-xl comic-shadow">
        <h1 className="font-bangers text-3xl text-comic-ink flex items-center gap-2">
          <ShieldX className="w-8 h-8 text-red-500" /> KONTROL & PENGGUNA TEKAKOMIK
        </h1>
        <p className="text-xs font-sans text-gray-700">
          Ban secara permanen atau suspend dengan jangka waktu tertentu. Akun yang dibanned/suspend disembunyikan dari Leaderboard.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white comic-border p-3.5 rounded-xl comic-shadow flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari berdasarkan Username atau Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-xs w-full text-comic-ink"
        />
      </div>

      {/* USER LIST TABLE */}
      <div className="bg-white comic-border p-5 rounded-xl comic-shadow overflow-hidden">
        <h2 className="font-bangers text-xl text-comic-ink mb-3">DAFTAR DETEKTIF ({filteredUsers.length})</h2>
        {loading ? (
          <div className="p-8 text-center font-bangers text-2xl animate-pulse text-comic-ink">MEMUAT PENGGUNA...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-comic-yellow comic-border-sm font-bangers text-sm">
                  <th className="p-2 border border-comic-ink">EMAIL</th>
                  <th className="p-2 border border-comic-ink">USERNAME</th>
                  <th className="p-2 border border-comic-ink">STATUS</th>
                  <th className="p-2 border border-comic-ink">BATAS WAKTU SUSPEND</th>
                  <th className="p-2 border border-comic-ink">ALASAN BAN</th>
                  <th className="p-2 border border-comic-ink">TERDAFTAR</th>
                  <th className="p-2 border border-comic-ink text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                      Tidak ada pengguna yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.id === session?.user?.id;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="p-2 font-bold">{u.email || "-"}</td>
                        <td className="p-2 font-bangers text-sm text-comic-ink">{u.username}</td>
                        <td className="p-2">
                          <span
                            className={`font-bangers text-[10px] px-2 py-0.5 rounded comic-border-sm ${
                              u.isBanned ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                            }`}
                          >
                            {u.isBanned ? "BANNED" : "AKTIF"}
                          </span>
                        </td>
                        <td className="p-2 font-bold text-red-600">
                          {u.bannedUntil ? new Date(u.bannedUntil).toLocaleString("id-ID") : u.isBanned ? "PERMANEN" : "-"}
                        </td>
                        <td className="p-2 text-gray-600 italic truncate max-w-xs">{u.banReason || "-"}</td>
                        <td className="p-2 text-[10px] text-gray-500">{new Date(u.createdAt).toLocaleDateString("id-ID")}</td>
                        <td className="p-2 text-center">
                          {!isSelf && u.role !== "ADMIN" ? (
                            <button
                              onClick={() => handleToggleBan(u.id, u.isBanned)}
                              className={`p-1.5 rounded comic-border-sm font-bangers text-xs text-white ${
                                u.isBanned ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
                              }`}
                            >
                              {u.isBanned ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>
                          ) : (
                            <span className="text-[10px] font-sans text-gray-400 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BAN CONFIRMATION MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white comic-border p-5 rounded-xl comic-shadow-lg max-w-md w-full flex flex-col gap-4">
            <div className="bg-red-500 text-white p-3 rounded-lg comic-border-sm flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 shrink-0 animate-bounce" />
              <h3 className="font-bangers text-xl">BAN / BEKUKAN AKUN PENGGUNA</h3>
            </div>

            <div className="flex flex-col gap-3 font-sans text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bangers text-sm text-comic-ink">ALASAN PEMBEKUAN / SUSPEND:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tulis alasan pembekuan akun di sini (akan ditampilkan ke pengguna)..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="bg-gray-50 comic-border p-2.5 rounded text-xs text-comic-ink"
                />
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="tempCheck"
                  checked={isTemporary}
                  onChange={(e) => setIsTemporary(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="tempCheck" className="font-bangers text-sm text-comic-ink">
                  Suspend Sementara (Dengan Batas Waktu)
                </label>
              </div>

              {isTemporary && (
                <div className="flex flex-col gap-1 mt-1 border-t border-gray-100 pt-2">
                  <label className="font-bangers text-sm text-red-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> BATAS WAKTU SUSPEND S/D:
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bannedUntil}
                    onChange={(e) => setBannedUntil(e.target.value)}
                    className="bg-gray-50 comic-border px-3 py-2 rounded font-sans text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setActionUserId(null);
                }}
                className="comic-btn text-xs bg-gray-200 hover:bg-gray-300 text-comic-ink"
              >
                BATAL
              </button>
              <button
                onClick={submitBanAction}
                className="comic-btn text-xs bg-red-500 hover:bg-red-600 text-white"
              >
                SUSPEND AKUN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

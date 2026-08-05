import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { emailOrUsername, tintaAmount } = await request.json();

    if (!emailOrUsername || !tintaAmount || isNaN(Number(tintaAmount))) {
      return NextResponse.json({ error: "Email/Username dan jumlah Tinta wajib diisi!" }, { status: 400 });
    }

    const amount = Number(tintaAmount);
    if (amount <= 0) {
      return NextResponse.json({ error: "Jumlah tinta harus lebih dari 0!" }, { status: 400 });
    }

    // Cari user berdasarkan username atau email
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername.trim() },
          { username: emailOrUsername.trim() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna (Email/Username) tidak ditemukan!" }, { status: 404 });
    }

    // Update tinta user
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        tinta: { increment: amount },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil menambahkan +${amount} Tinta kepada ${updated.username}!`,
      user: {
        username: updated.username,
        email: updated.email,
        tinta: updated.tinta,
      },
    });
  } catch (error) {
    console.error("Error giving tinta:", error);
    return NextResponse.json({ error: "Gagal memberikan tinta kepada pengguna" }, { status: 500 });
  }
}

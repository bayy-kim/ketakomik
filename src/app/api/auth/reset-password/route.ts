import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token dan Password baru wajib diisi!" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter!" }, { status: 400 });
    }

    // Cari token reset
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token tidak valid atau telah kedaluwarsa!" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User dengan email tersebut tidak ditemukan!" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update password user & hapus token yang sudah digunakan
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      db.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Kata sandi berhasil diperbarui!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Gagal memperbarui kata sandi" }, { status: 500 });
  }
}

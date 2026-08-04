import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi!" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) {
      // Security practice: do not reveal if email is not found to prevent user enumeration.
      return NextResponse.json({ success: true, message: "Jika email terdaftar, instruksi reset sandi telah dikirim." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 jam dari sekarang

    // Simpan token
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Simulasi pengiriman email untuk demo
    console.log(`[FORGOT PASSWORD] Reset link: http://localhost:3000/reset-password?token=${token}`);

    return NextResponse.json({
      success: true,
      message: "Instruksi reset sandi berhasil dikirim ke email kamu!",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json({ error: "Gagal memproses permintaan reset sandi" }, { status: 500 });
  }
}

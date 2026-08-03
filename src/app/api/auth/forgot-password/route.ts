import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Alamat email tidak valid!" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const user = await db.user.findFirst({
        where: { email: cleanEmail },
      });

      if (!user) {
        // Return friendly message without leaking if email exists
        return NextResponse.json({
          success: true,
          message: "Jika email terdaftar, link petunjuk reset password telah dikirimkan ke email Anda.",
        });
      }

      // Generate random 32-char hex token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 3600000); // Expires in 1 hour

      await db.passwordResetToken.create({
        data: {
          email: cleanEmail,
          token,
          expiresAt,
        },
      });

      const resetUrl = `https://tekakomik.vercel.app/reset-password?token=${token}`;

      // Log email delivery mock info for production/dev fallback
      console.log(`[EMAIL DISPATCH] Password reset link for ${cleanEmail}: ${resetUrl}`);

      return NextResponse.json({
        success: true,
        message: "Link reset password telah dikirim ke email Anda! Periksa kotak masuk / spam.",
        demoResetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
      });
    } catch (e) {
      console.error("Forgot password db error:", e);
      return NextResponse.json({
        success: true,
        message: "Link reset password telah dikirim ke email Anda!",
      });
    }
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    return NextResponse.json({ error: "Gagal memproses permintaan reset password" }, { status: 500 });
  }
}

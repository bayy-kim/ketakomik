import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, dan password wajib diisi!" }, { status: 400 });
    }

    if (username.trim().length < 3) {
      return NextResponse.json({ error: "Username minimal 3 karakter!" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter!" }, { status: 400 });
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email atau Username sudah digunakan!" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        username: username.trim(),
        email,
        passwordHash,
        tinta: 100, // Bonus tinta pendaftaran
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Gagal melakukan pendaftaran akun" }, { status: 500 });
  }
}

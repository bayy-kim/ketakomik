import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isBanned: true,
        banReason: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching admin users list:", error);
    return NextResponse.json({ error: "Gagal memuat daftar pengguna" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { userId, isBanned, banReason } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID wajib diisi" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        isBanned,
        banReason: isBanned ? banReason || "Melanggar peraturan komunitas" : null,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error toggling user ban:", error);
    return NextResponse.json({ error: "Gagal memperbarui status ban pengguna" }, { status: 500 });
  }
}

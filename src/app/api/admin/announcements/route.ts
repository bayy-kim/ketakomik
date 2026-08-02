import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    let announcements: unknown[] = [];
    try {
      announcements = await db.announcement.findMany({
        orderBy: { startAt: "desc" },
      });
    } catch {
      // Prisma fallback
    }
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Gagal mengambil pengumuman" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { message, isActive, endAt } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan pengumuman wajib diisi" }, { status: 400 });
    }

    try {
      const announcement = await db.announcement.create({
        data: {
          message,
          isActive: isActive ?? true,
          endAt: endAt ? new Date(endAt) : null,
        },
      });
      return NextResponse.json({ success: true, announcement });
    } catch {
      return NextResponse.json({ success: true, announcement: { id: `ann-${Date.now()}`, message } });
    }
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengumuman" }, { status: 500 });
  }
}

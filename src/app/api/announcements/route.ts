import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      where: { isActive: true },
      orderBy: { startAt: "desc" },
    });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Gagal mengambil pengumuman" }, { status: 500 });
  }
}

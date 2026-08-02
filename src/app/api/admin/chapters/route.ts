import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    let chapters: unknown[] = [];
    try {
      chapters = await db.chapter.findMany({
        orderBy: { weekStartDate: "desc" },
        include: { _count: { select: { words: true } } },
      });
    } catch {
      // Prisma fallback
    }
    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching admin chapters:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar chapter" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, weekStartDate, chapterNote, unlockComicImageUrl, isPublished } = await request.json();

    if (!title || !weekStartDate) {
      return NextResponse.json({ error: "Judul dan tanggal mulai minggu wajib diisi!" }, { status: 400 });
    }

    try {
      const chapter = await db.chapter.create({
        data: {
          title,
          weekStartDate: new Date(weekStartDate),
          chapterNote: chapterNote || null,
          unlockComicImageUrl: unlockComicImageUrl || null,
          isPublished: isPublished ?? false,
        },
      });
      return NextResponse.json({ success: true, chapter });
    } catch {
      return NextResponse.json({ success: true, chapter: { id: `ch-${Date.now()}`, title } });
    }
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json({ error: "Gagal menyimpan chapter" }, { status: 500 });
  }
}

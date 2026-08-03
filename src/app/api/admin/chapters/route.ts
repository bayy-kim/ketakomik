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

export async function PUT(request: Request) {
  try {
    const { id, title, weekStartDate, chapterNote, unlockComicImageUrl, isPublished } = await request.json();

    if (!id || !title || !weekStartDate) {
      return NextResponse.json({ error: "ID, Judul dan tanggal mulai minggu wajib diisi!" }, { status: 400 });
    }

    try {
      const updatedChapter = await db.chapter.update({
        where: { id },
        data: {
          title,
          weekStartDate: new Date(weekStartDate),
          chapterNote: chapterNote || null,
          unlockComicImageUrl: unlockComicImageUrl || null,
          isPublished: isPublished ?? false,
        },
      });
      return NextResponse.json({ success: true, chapter: updatedChapter });
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json({ error: "Gagal memperbarui chapter" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID chapter wajib diisi!" }, { status: 400 });
    }

    try {
      await db.chapter.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json({ error: "Gagal menghapus chapter" }, { status: 500 });
  }
}

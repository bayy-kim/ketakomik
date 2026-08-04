import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const chapters = await db.chapter.findMany({
      orderBy: { weekStartDate: "desc" },
      include: { _count: { select: { words: true } } },
    });
    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching admin chapters:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar chapter" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { title, weekStartDate, chapterNote, unlockComicImageUrl, isPublished } = await request.json();

    if (!title || !weekStartDate) {
      return NextResponse.json({ error: "Judul dan tanggal mulai minggu wajib diisi!" }, { status: 400 });
    }

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
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json({ error: "Gagal menyimpan chapter" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { id, title, weekStartDate, chapterNote, unlockComicImageUrl, isPublished } = await request.json();

    if (!id || !title || !weekStartDate) {
      return NextResponse.json({ error: "ID, Judul dan tanggal mulai minggu wajib diisi!" }, { status: 400 });
    }

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
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json({ error: "Gagal memperbarui chapter" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID chapter wajib diisi!" }, { status: 400 });
    }

    await db.chapter.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json({ error: "Gagal menghapus chapter" }, { status: 500 });
  }
}

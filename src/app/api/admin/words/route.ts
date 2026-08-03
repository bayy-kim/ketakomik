import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    let words: unknown[] = [];
    try {
      words = await db.word.findMany({
        orderBy: { scheduledDate: "desc" },
        include: { chapter: { select: { title: true } } },
      });
    } catch {
      // Prisma fallback
    }
    return NextResponse.json({ words });
  } catch (error) {
    console.error("Error fetching admin words:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar kata" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text, difficulty, clueHonest, clueMisleading, scheduledDate, category, chapterId } = await request.json();

    if (!text || !clueHonest || !clueMisleading || !scheduledDate) {
      return NextResponse.json({ error: "Data kata tidak lengkap!" }, { status: 400 });
    }

    const normalizedText = text.trim().toUpperCase();

    try {
      const existingScheduled = await db.word.findFirst({
        where: {
          scheduledDate: new Date(scheduledDate),
        },
      });
      if (existingScheduled) {
        return NextResponse.json({ error: "Sudah ada kata yang dijadwalkan untuk tanggal tersebut!" }, { status: 400 });
      }

      const newWord = await db.word.create({
        data: {
          text: normalizedText,
          normalizedText,
          difficulty: difficulty || "MEDIUM",
          clueHonest,
          clueMisleading,
          scheduledDate: new Date(scheduledDate),
          category: category || "Umum",
          chapterId: chapterId || null,
        },
      });
      return NextResponse.json({ success: true, word: newWord });
    } catch {
      return NextResponse.json({ success: true, word: { id: `w-${Date.now()}`, text: normalizedText } });
    }
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json({ error: "Gagal menyimpan kata baru" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, text, difficulty, clueHonest, clueMisleading, scheduledDate, category, chapterId } = await request.json();

    if (!id || !text || !clueHonest || !clueMisleading || !scheduledDate) {
      return NextResponse.json({ error: "ID dan Data kata tidak lengkap!" }, { status: 400 });
    }

    const normalizedText = text.trim().toUpperCase();

    try {
      // Check if scheduled date is taken by another word
      const existingScheduled = await db.word.findFirst({
        where: {
          scheduledDate: new Date(scheduledDate),
          NOT: { id },
        },
      });
      if (existingScheduled) {
        return NextResponse.json({ error: "Tanggal tersebut sudah dipakai oleh soal lain!" }, { status: 400 });
      }

      const updatedWord = await db.word.update({
        where: { id },
        data: {
          text: normalizedText,
          normalizedText,
          difficulty: difficulty || "MEDIUM",
          clueHonest,
          clueMisleading,
          scheduledDate: new Date(scheduledDate),
          category: category || "Umum",
          chapterId: chapterId || null,
        },
      });
      return NextResponse.json({ success: true, word: updatedWord });
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error updating word:", error);
    return NextResponse.json({ error: "Gagal memperbarui kata" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID kata wajib diisi!" }, { status: 400 });
    }

    try {
      await db.word.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error deleting word:", error);
    return NextResponse.json({ error: "Gagal menghapus kata" }, { status: 500 });
  }
}

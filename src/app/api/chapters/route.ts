import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const chapters = await db.chapter.findMany({
      where: { isPublished: true },
      include: { words: { select: { id: true, scheduledDate: true, difficulty: true, category: true } } },
      orderBy: { weekStartDate: "asc" },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ error: "Gagal mengambil data chapter" }, { status: 500 });
  }
}

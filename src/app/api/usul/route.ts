import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Anda harus login terlebih dahulu untuk mengusulkan kata!" }, { status: 401 });
    }

    const { text, note } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 3 || text.trim().length > 10) {
      return NextResponse.json({ error: "Kata usulan harus antara 3 hingga 10 huruf!" }, { status: 400 });
    }

    const cleanText = text.trim().toUpperCase();

    const suggestion = await db.wordSuggestion.create({
      data: {
        text: cleanText,
        note: note || null,
        submittedByUserId: currentUserId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, id: suggestion.id });
  } catch (error) {
    console.error("Error submitting word suggestion:", error);
    return NextResponse.json({ error: "Gagal mengirim usulan kata" }, { status: 500 });
  }
}

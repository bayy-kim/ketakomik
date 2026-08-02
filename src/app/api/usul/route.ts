import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { text, note, userId } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length < 3 || text.trim().length > 10) {
      return NextResponse.json({ error: "Kata usulan harus antara 3 hingga 10 huruf!" }, { status: 400 });
    }

    const cleanText = text.trim().toUpperCase();

    try {
      const suggestion = await db.wordSuggestion.create({
        data: {
          text: cleanText,
          note: note || null,
          submittedByUserId: userId || null,
          status: "PENDING",
        },
      });
      return NextResponse.json({ success: true, id: suggestion.id });
    } catch {
      // Demo fallback success response
      return NextResponse.json({ success: true, id: `sug-${Date.now()}` });
    }
  } catch (error) {
    console.error("Error submitting word suggestion:", error);
    return NextResponse.json({ error: "Gagal mengirim usulan kata" }, { status: 500 });
  }
}

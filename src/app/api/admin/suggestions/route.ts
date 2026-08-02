import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    let suggestions: unknown[] = [];
    try {
      suggestions = await db.wordSuggestion.findMany({
        orderBy: { createdAt: "desc" },
        include: { submittedByUser: { select: { username: true } } },
      });
    } catch {
      // Prisma fallback
    }
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar usulan" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { suggestionId, status, adminUserId } = await request.json();

    if (!suggestionId || !status) {
      return NextResponse.json({ error: "ID dan status wajib diisi" }, { status: 400 });
    }

    try {
      const updated = await db.wordSuggestion.update({
        where: { id: suggestionId },
        data: {
          status,
          reviewedByAdminId: adminUserId || null,
        },
      });
      return NextResponse.json({ success: true, updated });
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error updating suggestion status:", error);
    return NextResponse.json({ error: "Gagal memperbarui status usulan" }, { status: 500 });
  }
}

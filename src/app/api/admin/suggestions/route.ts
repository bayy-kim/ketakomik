import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const suggestions = await db.wordSuggestion.findMany({
      orderBy: { createdAt: "desc" },
      include: { submittedByUser: { select: { username: true } } },
    });
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar usulan" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { suggestionId, status, adminUserId } = await request.json();

    if (!suggestionId || !status) {
      return NextResponse.json({ error: "ID dan status wajib diisi" }, { status: 400 });
    }

    const updated = await db.wordSuggestion.update({
      where: { id: suggestionId },
      data: {
        status,
        reviewedByAdminId: adminUserId || null,
      },
    });
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Error updating suggestion status:", error);
    return NextResponse.json({ error: "Gagal memperbarui status usulan" }, { status: 500 });
  }
}

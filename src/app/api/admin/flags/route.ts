import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const flags = await db.featureFlag.findMany();
    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return NextResponse.json({ error: "Gagal mengambil feature flags" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { key, isEnabled } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Key feature flag wajib diisi" }, { status: 400 });
    }

    const flag = await db.featureFlag.upsert({
      where: { key },
      update: { isEnabled },
      create: { key, isEnabled },
    });
    return NextResponse.json({ success: true, flag });
  } catch (error) {
    console.error("Error updating feature flag:", error);
    return NextResponse.json({ error: "Gagal memperbarui feature flag" }, { status: 500 });
  }
}

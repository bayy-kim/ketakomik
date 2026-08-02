import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    let flags: unknown[] = [];
    try {
      flags = await db.featureFlag.findMany();
    } catch {
      // Prisma fallback
    }

    if (!flags || flags.length === 0) {
      flags = [
        { id: "f1", key: "duel_mode", isEnabled: true },
        { id: "f2", key: "hardcore_mode", isEnabled: true },
        { id: "f3", key: "maintenance_mode", isEnabled: false },
      ];
    }

    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return NextResponse.json({ error: "Gagal mengambil feature flags" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, isEnabled } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Key feature flag wajib diisi" }, { status: 400 });
    }

    try {
      const flag = await db.featureFlag.upsert({
        where: { key },
        update: { isEnabled },
        create: { key, isEnabled },
      });
      return NextResponse.json({ success: true, flag });
    } catch {
      return NextResponse.json({ success: true, flag: { key, isEnabled } });
    }
  } catch (error) {
    console.error("Error updating feature flag:", error);
    return NextResponse.json({ error: "Gagal memperbarui feature flag" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const announcements = await db.announcement.findMany({
      orderBy: { startAt: "desc" },
    });
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Gagal mengambil pengumuman" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { message, isActive, endAt } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan pengumuman wajib diisi" }, { status: 400 });
    }

    const announcement = await db.announcement.create({
      data: {
        message,
        isActive: isActive ?? true,
        endAt: endAt ? new Date(endAt) : null,
      },
    });
    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengumuman" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { id, message, isActive, endAt } = await request.json();

    if (!id || !message) {
      return NextResponse.json({ error: "ID dan Pesan pengumuman wajib diisi" }, { status: 400 });
    }

    const announcement = await db.announcement.update({
      where: { id },
      data: {
        message,
        isActive: isActive ?? true,
        endAt: endAt ? new Date(endAt) : null,
      },
    });
    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengumuman" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pengumuman wajib diisi!" }, { status: 400 });
    }

    await db.announcement.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Gagal menghapus pengumuman" }, { status: 500 });
  }
}

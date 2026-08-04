import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session || !session.user || (session.user as { role?: string })?.role !== "ADMIN") {
    return {
      authorized: false as const,
      response: NextResponse.json({ error: "Akses ditolak. Membutuhkan hak akses Admin!" }, { status: 403 }),
    };
  }
  return {
    authorized: true as const,
    session,
  };
}

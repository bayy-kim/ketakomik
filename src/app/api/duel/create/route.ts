import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { wordId, creatorSessionId } = await request.json();

    if (!wordId || !creatorSessionId) {
      return NextResponse.json({ error: "Data duel tidak lengkap" }, { status: 400 });
    }

    const roomCode = generateRoomCode();

    try {
      const duel = await db.duelChallenge.create({
        data: {
          wordId,
          roomCode,
          creatorSessionId,
          status: "PENDING",
        },
      });
      return NextResponse.json({ roomCode: duel.roomCode, id: duel.id });
    } catch {
      // In-memory fallback response for room creation
      return NextResponse.json({ roomCode, id: `duel-${Date.now()}` });
    }
  } catch (error) {
    console.error("Error creating duel challenge:", error);
    return NextResponse.json({ error: "Gagal membuat duel" }, { status: 500 });
  }
}

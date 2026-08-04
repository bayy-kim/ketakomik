import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/auth";

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
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Anda harus login terlebih dahulu untuk membuat mode duel!" }, { status: 401 });
    }

    const { timeLimitSeconds = 120 } = await request.json().catch(() => ({}));

    // Ambil kata acak dari database
    let word = await db.word.findFirst({
      orderBy: { scheduledDate: "desc" },
    });

    if (!word) {
      word = await db.word.findFirst();
    }

    if (!word) {
      return NextResponse.json({ error: "Belum ada soal kata di database." }, { status: 400 });
    }

    const roomCode = generateRoomCode();

    const duel = await db.duelChallenge.create({
      data: {
        wordId: word.id,
        roomCode,
        creatorSessionId: userId,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      roomCode: duel.roomCode,
      id: duel.id,
      timeLimitSeconds,
    });
  } catch (error) {
    console.error("Error creating duel challenge:", error);
    return NextResponse.json({ error: "Gagal membuat duel" }, { status: 500 });
  }
}

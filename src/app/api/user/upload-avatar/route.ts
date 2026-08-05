import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized. Anda harus login!" }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 2 * 1024 * 1024, // Max 2MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Save the uploaded image url to the user profile
        try {
          await db.user.update({
            where: { id: currentUserId },
            data: { avatarUrl: blob.url },
          });
          console.log(`User ${currentUserId} updated custom avatar: ${blob.url}`);
        } catch (e) {
          console.error("Gagal menyimpan avatarUrl ke user:", e);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

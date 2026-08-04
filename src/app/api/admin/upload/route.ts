import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Uploaded comic panel blob:", blob.url);
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

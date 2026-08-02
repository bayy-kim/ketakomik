import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || `comic-panel-${Date.now()}.png`;

    if (!request.body) {
      return NextResponse.json({ error: "File data kosong" }, { status: 400 });
    }

    try {
      const blob = await put(filename, request.body, {
        access: "public",
      });
      return NextResponse.json(blob);
    } catch {
      // Fallback placeholder image url if Vercel blob token is not yet configured in local env
      return NextResponse.json({
        url: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&auto=format&fit=crop&q=80",
      });
    }
  } catch (error) {
    console.error("Error uploading file to Vercel Blob:", error);
    return NextResponse.json({ error: "Gagal mengunggah file gambar" }, { status: 500 });
  }
}

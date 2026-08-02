import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
    const isLoggedIn = !!token;
    const userRole = (token as { role?: string })?.role;

    if (!isLoggedIn || userRole !== "ADMIN") {
      if (nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/auth/login?error=admin_required", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

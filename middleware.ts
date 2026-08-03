import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = (token as { role?: string })?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/api/admin");
  const isProtectedGameRoute =
    nextUrl.pathname.startsWith("/play") ||
    nextUrl.pathname.startsWith("/chapter") ||
    nextUrl.pathname.startsWith("/duel") ||
    nextUrl.pathname.startsWith("/usul");

  // 1. Strict Admin Route Protection (Hacker / Non-admin Security Isolation)
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      if (nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access Denied. Forbidden." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/auth/login?error=admin_required", nextUrl));
    }
  }

  // 2. Strict Game Route Protection (Requires Login First)
  if (isProtectedGameRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login?error=login_required", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/play/:path*", "/chapter/:path*", "/duel/:path*", "/usul/:path*"],
};

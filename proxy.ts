import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const isHttps = nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
  
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    secureCookie: isHttps,
  });

  const isLoggedIn = !!token;
  const userRole = (token as { role?: string })?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/dashboardadmin") || nextUrl.pathname.startsWith("/api/admin");
  const isProtectedGameRoute =
    nextUrl.pathname.startsWith("/play") ||
    nextUrl.pathname.startsWith("/chapter") ||
    nextUrl.pathname.startsWith("/duel") ||
    nextUrl.pathname.startsWith("/usul") ||
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/leaderboard");

  // 1. Strict Admin Route Protection (Only logged-in ADMIN allowed on /dashboardadmin & /api/admin/*)
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
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboardadmin/:path*", "/api/admin/:path*", "/play/:path*", "/chapter/:path*", "/duel/:path*", "/usul/:path*", "/dashboard/:path*", "/leaderboard/:path*"],
};

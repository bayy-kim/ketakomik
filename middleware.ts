import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string })?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      if (nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/auth/login?error=admin_required", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

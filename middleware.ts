import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Local-dev port split: admin runs on :3000, the volunteer portal on :3001.
// Change PORTAL_PORT if you start the portal on a different port.
const PORTAL_PORT = "3001";

const ADMIN_ONLY_PREFIXES = [
  "/dashboard",
  "/volunteers",
  "/events",
  "/organizations",
  "/attendance",
  "/certificates",
  "/analytics",
  "/leaderboard",
  "/chatbot",
  "/settings",
];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const isPortalHost = host.includes(`:${PORTAL_PORT}`);

  const isAdminPath = matchesPrefix(pathname, ADMIN_ONLY_PREFIXES);
  const isPortalPath = pathname === "/portal" || pathname.startsWith("/portal/");

  // Volunteer portal (localhost:3001) should never render admin pages.
  if (isPortalHost && isAdminPath) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  // Admin (localhost:3000) should never render the volunteer portal.
  if (!isPortalHost && isPortalPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin root ("/") skips the marketing landing page and goes straight
  // into the sidebar admin view.
  if (!isPortalHost && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

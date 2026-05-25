import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes that require the user to be authenticated
const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"];

// Routes that authenticated users should NOT be able to visit
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // 1. Authenticated user visits sign-in / sign-up → send them to the dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // 2. Unauthenticated user visits a protected route → send them to sign-in
  if (!isLoggedIn && isProtected) {
    const signInUrl = new URL("/auth/signin", nextUrl);
    // Preserve the intended destination so after login they land on the right page
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

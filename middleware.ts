import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/auth/")) {
        return NextResponse.next();
    }

    // Check for Supabase auth cookies (the frontend sets these)
    // Supabase uses cookies with pattern: sb-*-auth-token
    const cookies = request.cookies;
    const hasAuthCookie = Array.from(cookies.getAll()).some(
        (cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token")
    );

    // If no auth cookie and trying to access protected route, redirect to login
    if (!hasAuthCookie) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

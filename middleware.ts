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

    // ⚠️ AUTHENTICATION DISABLED - All routes are now public
    // Remove the comments below to re-enable authentication

    // // Allow public routes
    // if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/auth/")) {
    //     return NextResponse.next();
    // }

    // // Check for auth cookie (adjust cookie name based on backend implementation)
    // const authCookie = request.cookies.get("auth_token");

    // // If no auth cookie and trying to access protected route, redirect to login
    // if (!authCookie) {
    //     const loginUrl = new URL("/auth/login", request.url);
    //     loginUrl.searchParams.set("redirect", pathname);
    //     return NextResponse.redirect(loginUrl);
    // }

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

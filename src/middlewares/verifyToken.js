/* Plugins. */
import { NextResponse } from "next/server";

export async function middleware(req) {
    const { pathname, origin } = req.nextUrl;

    const isAdmin = pathname.startsWith("/siteadmin");
    if (!isAdmin) return NextResponse.next();

    const isLogin = pathname === "/siteadmin/login";

    // Call backend verify API with cookies
    const verifyRes = await fetch(`${origin}/api/auth/tokenVerification`, {
        headers: { cookie: req.headers.get("cookie") || "" },
    });

    const isValid = verifyRes.ok;

    // If user visits login and token is valid => redirect dashboard
    if (isLogin && isValid) {
        return NextResponse.redirect(new URL("/siteadmin/dashboard", req.url));
    }

    // If user visits private admin routes and token invalid => redirect login
    if (!isLogin && !isValid) {
        return NextResponse.redirect(new URL("/siteadmin/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/siteadmin/:path*"],
};

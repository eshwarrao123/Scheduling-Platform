import { NextRequest, NextResponse } from "next/server";

// Auth is handled client-side via localStorage on the dashboard.
// Middleware auth check temporarily disabled.
export function middleware(req: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/settings/:path*", "/events/:path*", "/bookings/:path*", "/availability/:path*"],
};



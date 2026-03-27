import { NextResponse } from "next/server";

// POST /api/auth/logout — clears the auth cookie
export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set("schedula_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0, // expire immediately
        path: "/",
    });

    return response;
}

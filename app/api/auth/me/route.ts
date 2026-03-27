import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractBearerToken } from "@/lib/auth";

// POST /api/auth/me — returns decoded user info from JWT
export async function GET(request: NextRequest) {
    const token = extractBearerToken(request.headers.get("authorization"));

    if (!token) {
        return NextResponse.json(
            { success: false, error: "No token provided" },
            { status: 401 }
        );
    }

    const payload = verifyToken(token);

    if (!payload) {
        return NextResponse.json(
            { success: false, error: "Invalid or expired token" },
            { status: 401 }
        );
    }

    return NextResponse.json({ success: true, user: payload });
}

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractBearerToken, JWTPayload } from "@/lib/auth";

/**
 * withAuth — HOF that wraps a route handler and injects the decoded JWT payload.
 *
 * Usage:
 *   export const GET = withAuth(async (req, payload) => { ... })
 */
export function withAuth(
    handler: (req: NextRequest, payload: JWTPayload) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const token = extractBearerToken(req.headers.get("authorization"));

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
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

        return handler(req, payload);
    };
}

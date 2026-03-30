import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { verifyToken, extractBearerToken } from "@/lib/auth";
import Availability from "@/models/Availability";

// GET /api/availability — fetch current user's availability
export async function GET(req: NextRequest) {
    const token = extractBearerToken(req.headers.get("authorization"));
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
        );
    }

    try {
        await connectToDB();

        const slots = await Availability.find({ userId: payload.userId })
            .select("-__v")
            .sort({ day: 1 })
            .lean();

        return NextResponse.json({ success: true, data: slots });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

// POST /api/availability — upsert a day's availability
export async function POST(req: NextRequest) {
    const token = extractBearerToken(req.headers.get("authorization"));
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
        );
    }

    try {
        await connectToDB();

        const body = await req.json();
        const { day, startTime, endTime, isActive } = body;

        if (!day || !startTime || !endTime) {
            return NextResponse.json(
                { success: false, error: "day, startTime, and endTime are required" },
                { status: 400 }
            );
        }

        if (startTime >= endTime) {
            return NextResponse.json(
                { success: false, error: "End time must be after start time" },
                { status: 400 }
            );
        }

        // Upsert: one slot per user per day
        const slot = await Availability.findOneAndUpdate(
            { userId: payload.userId, day },
            { startTime, endTime, isActive: isActive ?? true },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: slot }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server error";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

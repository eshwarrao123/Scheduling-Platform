import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Event from "@/models/Event";

// GET /api/events — list all active events
export async function GET() {
    try {
        await connectToDB();
        const events = await Event.find({ isActive: true })
            .populate("userId", "name username")
            .select("-__v")
            .lean();
        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

// POST /api/events — create an event type
export async function POST(request: Request) {
    try {
        await connectToDB();
        const body = await request.json();
        const event = await Event.create(body);
        return NextResponse.json({ success: true, data: event }, { status: 201 });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Failed to create event";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

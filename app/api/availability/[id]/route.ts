import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { verifyToken, extractBearerToken } from "@/lib/auth";
import Availability from "@/models/Availability";

// DELETE /api/availability/[id] — remove a slot (owner only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;

        const slot = await Availability.findOneAndDelete({
            _id: id,
            userId: payload.userId, // ensure ownership
        });

        if (!slot) {
            return NextResponse.json(
                { success: false, error: "Slot not found or not owned by you" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Slot removed" });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

// PATCH /api/availability/[id] — toggle isActive
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;
        const body = await req.json();

        const slot = await Availability.findOneAndUpdate(
            { _id: id, userId: payload.userId },
            { $set: { isActive: body.isActive } },
            { new: true, runValidators: true }
        );

        if (!slot) {
            return NextResponse.json(
                { success: false, error: "Slot not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: slot });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

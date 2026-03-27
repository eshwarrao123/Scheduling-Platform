import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();
        const { userId, guestName, guestEmail, date, time } = body;

        if (!userId || !guestName || !guestEmail || !date || !time) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Attempt to create booking - MongoDB enforces uniqueness on (userId, date, time)
        const booking = await Booking.create({
            userId,
            guestName,
            guestEmail,
            date,
            time,
        });

        return NextResponse.json({ success: true, data: booking }, { status: 201 });
    } catch (error: any) {
        // 11000 is MongoDB's duplicate key error code
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "This time slot has already been booked." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message || "Failed to create booking" },
            { status: 400 }
        );
    }
}

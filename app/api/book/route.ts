import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        if (!userId) return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });

        const bookings = await Booking.find({ userId }).sort({ selectedDate: 1, selectedTime: 1 }).lean();
        return NextResponse.json({ success: true, data: bookings });
    } catch (error: any) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();
        const { userId, eventId, name, email, selectedDate, selectedTime, timezone, calendarSynced } = body;

        if (!userId || !name || !email || !selectedDate || !selectedTime) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const booking = await Booking.create({
            userId,
            eventId,
            name,
            email,
            selectedDate,
            selectedTime,
            timezone,
            calendarSynced,
        });

        return NextResponse.json({ success: true, data: booking }, { status: 201 });
    } catch (error: any) {
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

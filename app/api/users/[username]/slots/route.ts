import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Availability from "@/models/Availability";
import Booking from "@/models/Booking";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const url = new URL(req.url);
        const dateStr = url.searchParams.get("date"); // e.g. "2023-11-01"

        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return NextResponse.json(
                { success: false, error: "Invalid date format, expect YYYY-MM-DD" },
                { status: 400 }
            );
        }

        await connectToDB();
        const user = await User.findOne({ username }).select("_id").lean();
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Determine day of week
        const dateObj = new Date(dateStr);
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayOfWeek = days[dateObj.getUTCDay()];

        // Get availability for this day
        const availability = await Availability.findOne({
            userId: user._id,
            day: dayOfWeek,
            isActive: true,
        }).lean();

        if (!availability) {
            return NextResponse.json({ success: true, data: [] }); // No availability set/active for this day
        }

        // Generate 30 min slots
        const slots: string[] = [];
        const [startH, startM] = availability.startTime.split(":").map(Number);
        const [endH, endM] = availability.endTime.split(":").map(Number);

        let currentH = startH;
        let currentM = startM;

        while (currentH < endH || (currentH === endH && currentM < endM)) {
            const timeString = `${String(currentH).padStart(2, "0")}:${String(currentM).padStart(2, "0")}`;
            slots.push(timeString);

            currentM += 30;
            if (currentM >= 60) {
                currentH++;
                currentM -= 60;
            }
        }

        // Get existing bookings for this user on this date
        const bookings = await Booking.find({ userId: user._id, date: dateStr }).lean();
        const bookedTimes = new Set(bookings.map((b) => b.time));

        // Map slots to include availability
        const slotData = slots.map((slot) => ({
            time: slot,
            available: !bookedTimes.has(slot),
        }));

        return NextResponse.json({ success: true, data: slotData });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

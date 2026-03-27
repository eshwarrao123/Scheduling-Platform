import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        await connectToDB();
        const { username } = await params;

        // Select safe fields to display on the public page
        const user = await User.findOne({ username }).select("name username _id").lean();

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Server error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

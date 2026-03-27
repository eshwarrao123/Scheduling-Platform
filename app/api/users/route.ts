import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users — list all users (paginated later)
export async function GET() {
    try {
        await connectToDB();
        const users = await User.find({}).select("-__v").limit(20).lean();
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST /api/users — create a user
export async function POST(request: Request) {
    try {
        await connectToDB();
        const body = await request.json();
        const user = await User.create(body);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Failed to create user";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

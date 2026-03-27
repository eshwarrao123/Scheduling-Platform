import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
    try {
        await connectToDB();
        return NextResponse.json({ ok: true, db: "connected" });
    } catch (error) {
        console.error("DB connection failed:", error);
        return NextResponse.json(
            { ok: false, db: "disconnected", error: "Could not reach MongoDB" },
            { status: 500 }
        );
    }
}

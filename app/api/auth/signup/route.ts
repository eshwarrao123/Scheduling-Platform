import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { hashPassword, signToken } from "@/lib/auth";
import User from "@/models/User";

interface SignupBody {
    name: string;
    email: string;
    username: string;
    password: string;
    timezone?: string;
}

// POST /api/auth/signup
export async function POST(request: Request) {
    try {
        await connectToDB();

        const body: SignupBody = await request.json();
        const { name, email, username, password, timezone } = body;

        // ── Validate required fields ──────────────────────────────────────────────
        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // ── Check uniqueness ──────────────────────────────────────────────────────
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return NextResponse.json(
                { success: false, error: "Email is already registered" },
                { status: 409 }
            );
        }

        const existingUsername = await User.findOne({
            username: username.toLowerCase(),
        });
        if (existingUsername) {
            return NextResponse.json(
                { success: false, error: "Username is already taken" },
                { status: 409 }
            );
        }

        // ── Hash password & create user ───────────────────────────────────────────
        const passwordHash = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            username,
            passwordHash,
            timezone: timezone || "UTC",
        });

        // ── Sign JWT ──────────────────────────────────────────────────────────────
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        const response = NextResponse.json(
            {
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    timezone: user.timezone,
                },
            },
            { status: 201 }
        );

        response.cookies.set("schedula_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

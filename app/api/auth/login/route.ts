import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { verifyPassword, signToken } from "@/lib/auth";
import User from "@/models/User";

interface LoginBody {
    email: string;
    password: string;
}

// POST /api/auth/login
export async function POST(request: Request) {
    try {
        await connectToDB();

        const body: LoginBody = await request.json();
        const { email, password } = body;

        // 1. Validate fields
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 2. Find user. We MUST use .select("+passwordHash") because our Mongoose Schema 
        // explicitly has `select: false` on the passwordHash field for security!
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            "+passwordHash"
        );

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 3. Verify password directly using bcrypt.compare
        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 4. Sign JWT
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        // 5. Respond with Token and User Data — set cookie for middleware
        const response = NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                timezone: user.timezone,
            },
        });

        // Set HTTP-only cookie so Next.js middleware can read it
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

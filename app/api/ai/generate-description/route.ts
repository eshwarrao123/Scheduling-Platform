import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
        }

        // Simple mock AI logic
        const lowerTitle = title.toLowerCase();
        let description = "Join this meeting to discuss updates, share progress, and align on our next steps. Looking forward to connecting with you.";

        if (lowerTitle.includes("interview")) {
            description = "Thank you for your interest! In this interview, we will discuss your background, experience, and mutual fit for the role. Please come prepared with any questions you might have.";
        } else if (lowerTitle.includes("discovery") || lowerTitle.includes("intro")) {
            description = "This is a quick introductory call to learn more about your goals, explore potential collaboration, and see how we can help you achieve success.";
        } else if (lowerTitle.includes("sync") || lowerTitle.includes("catch") || lowerTitle.includes("touch")) {
            description = "A quick alignment sync to review our current status, unblock any ongoing issues, and plan the upcoming deliverables.";
        } else if (lowerTitle.includes("demo") || lowerTitle.includes("presentation")) {
            description = "In this session, I'll walk you through our platform, highlight key features, and demonstrate how our solution can solve your specific challenges.";
        }

        // Simulate network delay to feel like AI generating (800ms)
        await new Promise((resolve) => setTimeout(resolve, 800));

        return NextResponse.json({ success: true, description });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to generate description" },
            { status: 500 }
        );
    }
}

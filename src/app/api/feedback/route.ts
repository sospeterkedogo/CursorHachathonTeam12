import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const FeedbackSchema = z.object({
    userId: z.string().min(1),
    username: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
}).refine(data => data.rating !== undefined || data.comment !== undefined, {
    message: "Either rating or comment must be provided",
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = FeedbackSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid feedback data", details: result.error.format() }, { status: 400 });
        }

        const { userId, username, rating, comment } = result.data;
        const db = await getDb();
        const feedbackCollection = db.collection("feedback");

        const feedbackEntry = {
            userId,
            username: username || "Anonymous",
            rating,
            comment,
            timestamp: new Date(),
        };

        await feedbackCollection.insertOne(feedbackEntry);

        return NextResponse.json({ success: true, message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const db = await getDb();
        const feedbackCollection = db.collection("feedback");

        const feedback = await feedbackCollection
            .find({})
            .sort({ timestamp: -1 })
            .toArray();

        return NextResponse.json({ feedback });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

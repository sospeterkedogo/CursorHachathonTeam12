import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDb();
        const users = db.collection("users");

        const leaderboard = await users
            .find(
                { totalScore: { $gt: 0 } }, // Only show users with score
                { projection: { username: 1, avatar: 1, totalScore: 1, userId: 1, _id: 0 } }
            )
            .sort({ totalScore: -1 })
            .limit(50)
            .toArray();

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ leaderboard: [] }, { status: 500 });
    }
}

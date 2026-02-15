import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET(req: any) {
    try {
        const db = await getDb();
        const users = db.collection("users");

        const leaderboard = await users
            .find(
                { totalScore: { $gt: 0 } }, // Only show users with score
                { projection: { username: 1, avatar: 1, totalScore: 1, userId: 1, _id: 0, lastActive: 1 } }
            )
            .sort({ totalScore: -1, lastActive: -1 })
            .limit(50)
            .toArray();

        const totalVerifiedUsers = await users.countDocuments({ totalScore: { $gt: 0 } });
        const totalVouchers = await db.collection("vouchers").countDocuments({});

        // Calculate User Rank if userId provided
        let userRank = null;
        let userData = null;
        const { searchParams } = new URL(req.url); // Fix: Get URL from request
        const userId = searchParams.get('userId');

        if (userId) {
            userData = await users.findOne({ userId });
            if (userData && userData.totalScore > 0) {
                // Rank is number of people with higher score OR same score but active more recently + 1
                const higherRanked = await users.countDocuments({
                    $or: [
                        { totalScore: { $gt: userData.totalScore } },
                        {
                            totalScore: userData.totalScore,
                            lastActive: { $gt: userData.lastActive || new Date(0) }
                        }
                    ]
                });
                userRank = higherRanked + 1;
            }
        }

        return NextResponse.json({ leaderboard, totalVerifiedUsers, totalVouchers, userRank, userData });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ leaderboard: [] }, { status: 500 });
    }
}

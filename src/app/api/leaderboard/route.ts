import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

const CACHE_TTL = 60000; // 60 seconds
let cachedLeaderboard: {
    data: any,
    timestamp: number
} | null = null;

export async function GET(req: any) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Check cache for base leaderboard data if no userId specific rank needed
        const now = Date.now();
        let baseData: any = null;

        if (cachedLeaderboard && (now - cachedLeaderboard.timestamp) < CACHE_TTL) {
            baseData = cachedLeaderboard.data;
        } else {
            const db = await getDb();
            const users = db.collection("users");

            const leaderboard = await users
                .find(
                    { totalScore: { $gt: 0 } },
                    { projection: { username: 1, avatar: 1, totalScore: 1, userId: 1, _id: 0, lastActive: 1 } }
                )
                .sort({ totalScore: -1, lastActive: -1 })
                .limit(50)
                .toArray();

            const totalVerifiedUsers = await users.countDocuments({ totalScore: { $gt: 0 } });
            const totalVouchers = await db.collection("vouchers").countDocuments({});

            // Aggregations for Global Stats
            const globalPointsAgg = await users.aggregate([
                { $group: { _id: null, total: { $sum: "$totalScore" } } }
            ]).toArray();
            const totalGlobalPoints = globalPointsAgg[0]?.total || 0;

            const globalCO2Agg = await users.aggregate([
                { $group: { _id: null, total: { $sum: "$totalCO2" } } }
            ]).toArray();
            const totalGlobalCO2 = globalCO2Agg[0]?.total || 0;

            baseData = { leaderboard, totalVerifiedUsers, totalVouchers, totalGlobalPoints, totalGlobalCO2 };
            cachedLeaderboard = { data: baseData, timestamp: now };
        }

        const { leaderboard, totalVerifiedUsers, totalVouchers, totalGlobalPoints, totalGlobalCO2 } = baseData;

        // Calculate User Rank if userId provided (this part is not cached as it's user-specific)
        let userRank = null;
        let userData = null;

        if (userId) {
            const db = await getDb();
            const users = db.collection("users");
            userData = await users.findOne({ userId });
            if (userData && userData.totalScore > 0) {
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

        return NextResponse.json({
            leaderboard,
            totalVerifiedUsers,
            totalVouchers,
            totalGlobalPoints,
            totalGlobalCO2,
            userRank,
            userData
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ leaderboard: [] }, { status: 500 });
    }
}

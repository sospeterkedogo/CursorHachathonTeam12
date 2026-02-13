import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const db = await getDb();
        const { searchParams } = new URL(request.url);
        const targetUserId = searchParams.get('targetUserId');

        let claimedCount = 0;

        // 1. If targetUserId is provided, claim orphan scans first
        if (targetUserId) {
            const result = await db.collection("scans").updateMany(
                { $or: [{ userId: null }, { userId: { $exists: false } }] },
                { $set: { userId: targetUserId } }
            );
            claimedCount = result.modifiedCount;
        }

        // 2. Re-aggregate scores from scans
        // Group all scans by userId to calculate total scores
        const userScores = await db.collection("scans").aggregate([
            {
                $match: { userId: { $exists: true, $ne: null } }
            },
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    lastActive: { $max: "$timestamp" }
                }
            }
        ]).toArray();

        let updatedCount = 0;

        for (const record of userScores) {
            if (!record._id) continue;

            await db.collection("users").updateOne(
                { userId: record._id },
                {
                    $set: {
                        totalScore: record.totalScore,
                        lastActive: record.lastActive || new Date()
                    },
                    $setOnInsert: {
                        username: "Early Adopter",
                        avatar: "👤"
                    }
                },
                { upsert: true }
            );
            updatedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Migrated ${updatedCount} users from scans.`,
            details: userScores
        });
    } catch (error) {
        console.error("Migration failed:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

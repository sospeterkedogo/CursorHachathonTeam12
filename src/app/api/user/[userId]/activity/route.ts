import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '0');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = page * limit;

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const db = await getDb();
        const scans = db.collection("scans");

        const query = { userId: userId };

        // Fetch paginated scans
        const userActivity = await scans
            .find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await scans.countDocuments(query);

        // Map ObjectId to string and ensure consistent formatting
        const formattedActivity = userActivity.map((s: any) => ({
            _id: s._id.toString(),
            userId: s.userId,
            image: s.image,
            actionType: s.actionType || "eco-action",
            score: s.score || 0,
            co2_saved: s.co2_saved || 0,
            verified: s.verified,
            status: s.status || (s.verified ? "completed" : "failed"),
            message: s.message,
            timestamp: s.timestamp instanceof Date ? s.timestamp.toISOString() : s.timestamp,
            username: s.username,
            avatar: s.avatar,
            isPublic: s.isPublic
        }));

        return NextResponse.json({
            activity: formattedActivity,
            totalCount,
            hasMore: skip + userActivity.length < totalCount
        });
    } catch (error) {
        console.error("Error fetching user activity:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

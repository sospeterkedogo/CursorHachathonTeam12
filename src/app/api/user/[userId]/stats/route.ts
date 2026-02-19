
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const db = await getDb();
        const scans = db.collection("scans");

        // Aggregate stats
        const userScans = await scans.find({ userId, verified: true }).toArray();

        const totalPoints = userScans.reduce((acc, scan) => acc + (scan.score || 0), 0);
        const totalCO2 = userScans.reduce((acc, scan) => acc + (scan.co2_saved || 0), 0);

        const totalActions = userScans.length;
        // Average Score is now Average Points per action
        const averageScore = totalActions > 0 ? Math.round(totalPoints / totalActions) : 0;

        // Calculate most common action
        const actionCounts: Record<string, number> = {};
        userScans.forEach(scan => {
            const type = scan.actionType || "unknown";
            actionCounts[type] = (actionCounts[type] || 0) + 1;
        });

        let mostCommonAction = "none";
        let maxCount = 0;
        Object.entries(actionCounts).forEach(([action, count]) => {
            if (count > maxCount) {
                mostCommonAction = action;
                maxCount = count;
            }
        });

        // Calculate streak (simplified: actions on consecutive days)
        // For now, just return 1 if active today, else 0, or mock logic.
        // Real implementation requires robust date diffing.
        const currentStreak = totalActions > 0 ? 1 : 0;

        // Sort logic for last action
        const lastAction = userScans.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        return NextResponse.json({
            userId,
            totalScore: totalPoints, // Returning Points as totalScore for compatibility
            totalPoints,             // Explicit field
            totalCO2,                // Explicit field
            totalActions,
            averageScore,
            mostCommonAction,
            currentStreak,
            recentActions: userScans.length, // Simplified "recent" to total for now
            actionTypes: actionCounts,
            lastActionDate: lastAction ? lastAction.timestamp : null
        });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

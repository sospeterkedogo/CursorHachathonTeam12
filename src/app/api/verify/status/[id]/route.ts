import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const db = await getDb();
        const scan = await db.collection("scans").findOne({ _id: new ObjectId(id) });

        if (!scan) {
            return NextResponse.json({ error: "Scan not found" }, { status: 404 });
        }

        return NextResponse.json({
            _id: scan._id.toString(),
            userId: scan.userId,
            status: scan.status || "completed", // Fallback for old scans
            verified: scan.verified,
            score: scan.score,
            actionType: scan.actionType,
            message: scan.message, // MiniMax message if stored
            audioUrl: scan.audioUrl,
            voucher: scan.voucher,
            timestamp: scan.timestamp
        });
    } catch (error) {
        console.error("Error fetching scan status:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

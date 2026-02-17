import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "User identity required" }, { status: 401 });
        }

        const db = await getDb();
        const scans = db.collection("scans");
        const users = db.collection("users");

        // Find the scan to confirm ownership and get the score to subtract
        const scan = await scans.findOne({ _id: new ObjectId(id) });

        if (!scan) {
            return NextResponse.json({ error: "Scan not found" }, { status: 404 });
        }

        if (scan.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized: You can only delete your own actions" }, { status: 403 });
        }

        // Delete the scan
        const deleteResult = await scans.deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 1) {
            // Decrement the user's total score
            const scoreToSubtract = scan.score || 0;
            if (scoreToSubtract > 0) {
                await users.updateOne(
                    { userId: userId },
                    { $inc: { totalScore: -scoreToSubtract } }
                );
            }

            const updatedUser = await users.findOne({ userId: userId });

            return NextResponse.json({
                success: true,
                message: "Action deleted and score updated",
                totalScore: updatedUser?.totalScore || 0
            });
        } else {
            return NextResponse.json({ error: "Failed to delete action" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error deleting scan:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { userId, isPublic } = body;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "User identity required" }, { status: 401 });
        }

        const db = await getDb();
        const scans = db.collection("scans");

        // Find the scan to confirm ownership
        const scan = await scans.findOne({ _id: new ObjectId(id) });

        if (!scan) {
            return NextResponse.json({ error: "Scan not found" }, { status: 404 });
        }

        if (scan.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Update the visibility
        await scans.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isPublic: !!isPublic } }
        );

        return NextResponse.json({ success: true, isPublic: !!isPublic });

    } catch (error) {
        console.error("Error updating scan visibility:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

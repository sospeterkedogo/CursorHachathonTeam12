import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const db = await getDb();

        // Delete user's scans
        await db.collection("scans").deleteMany({ userId });

        // Delete user's vouchers
        await db.collection("vouchers").deleteMany({ userId });

        // Delete user record
        const result = await db.collection("users").deleteOne({ userId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { voucherId } = await request.json();

        if (!voucherId) {
            return NextResponse.json({ error: "Missing voucherId" }, { status: 400 });
        }

        const db = await getDb();
        const result = await db.collection("vouchers").updateOne(
            { _id: new ObjectId(voucherId) },
            { $set: { used: true, redeemedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error redeeming voucher:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

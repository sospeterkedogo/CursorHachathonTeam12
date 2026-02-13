import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const db = await getDb();
        const vouchers = await db.collection("vouchers")
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ vouchers });

    } catch (error) {
        console.error("Error fetching vouchers:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

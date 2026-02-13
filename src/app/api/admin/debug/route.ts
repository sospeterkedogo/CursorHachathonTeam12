import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDb();
        const scans = await db.collection("scans").find({}).limit(20).toArray();
        const users = await db.collection("users").find({}).limit(20).toArray();
        return NextResponse.json({ scans, users });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

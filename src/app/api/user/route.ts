import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { userId, username, avatar } = await req.json();

        if (!userId || !username || !avatar) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = await getDb();
        const users = db.collection("users");

        await users.updateOne(
            { userId },
            {
                $set: {
                    username,
                    avatar,
                    lastActive: new Date()
                },
                $setOnInsert: {
                    totalScore: 0 // Initialize if not exists, though usually it should from verify
                }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ error: "Missing username" }, { status: 400 });
        }

        const db = await getDb();
        const users = db.collection("users");

        console.log(`Checking availability for: ${username}`);
        const existingUser = await users.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });

        return NextResponse.json({ available: !existingUser });
    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

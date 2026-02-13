const { MongoClient, ObjectId } = require('mongodb');

// ENV VARS should be passed via CLI
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "test";

async function testPersistentRedeem() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI is required");
        process.exit(1);
    }

    console.log("Testing Persistent Voucher Redemption...");

    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        const db = client.db(MONGODB_DB);
        const vouchers = db.collection("vouchers");

        // 1. Create a dummy voucher
        const dummyVoucher = {
            userId: "test-user-persistent",
            code: "TESTCODE123",
            title: "Test Voucher",
            description: "Testing persistence",
            used: false,
            createdAt: new Date()
        };
        const insertResult = await vouchers.insertOne(dummyVoucher);
        const voucherId = insertResult.insertedId.toString();
        console.log("Created voucher with ID:", voucherId);

        // 2. Call the redeem API via local fetch
        console.log("Calling redemption API...");
        const response = await fetch("http://localhost:3000/api/vouchers/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voucherId })
        });

        console.log("API Status:", response.status);
        const data = await response.json();
        console.log("API Response:", data);

        // 3. Verify in DB
        const updatedVoucher = await vouchers.findOne({ _id: new ObjectId(voucherId) });
        console.log("Updated Voucher in DB:", updatedVoucher);

        if (updatedVoucher && updatedVoucher.used === true) {
            console.log("✅ SUCCESS: Voucher marked as used in DB!");
        } else {
            console.log("❌ FAILURE: Voucher not marked as used.");
        }

        // Cleanup
        await vouchers.deleteOne({ _id: new ObjectId(voucherId) });

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await client.close();
    }
}

testPersistentRedeem();

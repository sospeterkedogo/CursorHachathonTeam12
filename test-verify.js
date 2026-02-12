
const fetch = require('node-fetch');

async function testVerify() {
    const imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // 1x1 pixel

    console.log("Testing /api/verify with dummy image...");
    try {
        const res = await fetch("http://127.0.0.1:3000/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageBase64 })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response data:", JSON.stringify(data, null, 2));
        console.log("Message Type:", typeof data.message);
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testVerify();

async function testSecurity() {
    const { default: fetch } = await import('node-fetch');
    const baseUrl = "http://localhost:3000/api";
    const userId = "test-user-" + Date.now();

    console.log("--- Testing Input Validation ---");
    const valRes = await fetch(`${baseUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "foo" }) // Missing userId
    });
    console.log(`Missing userId: ${valRes.status} (Expected 400)`);

    console.log("\n--- Testing Bot Detection (Honeypot) ---");
    const botRes = await fetch(`${baseUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, image: "foo", honeypot: "oops-i-am-a-bot" })
    });
    console.log(`Bot detected: ${botRes.status} (Expected 403)`);

    console.log("\n--- Testing Rate Limiting ---");
    for (let i = 0; i < 12; i++) {
        const res = await fetch(`${baseUrl}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, image: "foo", simulated: true })
        });
        console.log(`Request ${i + 1}: ${res.status}`);
        if (res.status === 429) {
            console.log("Rate limit triggered successfully!");
            break;
        }
        // Small delay to not overwhelm server processing but still trigger rate limit
        await new Promise(r => setTimeout(r, 100));
    }
}

testSecurity().catch(console.error);

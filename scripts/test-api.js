heirasync function testEndpoints() {
    const { default: fetch } = await import('node-fetch');
    console.log("Testing API Endpoints...");

    try {
        // 1. Test Leaderboard Stats
        console.log("\n1. Testing /api/leaderboard...");
        const lbRes = await fetch('http://localhost:3000/api/leaderboard');
        if (lbRes.ok) {
            const data = await lbRes.json();
            console.log("✅ Leaderboard fetch success");
            console.log("   - Total Users:", data.totalVerifiedUsers);
            console.log("   - Total Vouchers:", data.totalVouchers);
            console.log("   - Leaderboard Entries:", data.leaderboard.length);
        } else {
            console.error("❌ Leaderboard fetch failed:", lbRes.status);
        }

        // 2. Test Verification Simulation
        console.log("\n2. Testing /api/verify (Simulation)...");
        const verifyRes = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                simulated: true,
                userId: 'test-user-simulation',
                username: 'Test User',
                avatar: '🧪'
            })
        });

        if (verifyRes.ok) {
            const data = await verifyRes.json();
            console.log("✅ Simulation success");
            console.log("   - Verified:", data.verified);
            console.log("   - Score:", data.score);
            console.log("   - Voucher:", data.voucher ? "Generated" : "None");
        } else {
            console.error("❌ Simulation failed:", verifyRes.status);
        }

        // 3. Test Username Conflict (Duplicate Check)
        console.log("\n3. Testing Username Conflict Handling...");
        const uniqueName = `User-${Date.now()}`;

        // First Create: User A claims name
        const resA = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                simulated: true,
                userId: `user-A-${Date.now()}`,
                username: uniqueName,
                avatar: '🅰️'
            })
        });
        const dataA = await resA.json();
        if (dataA.error) console.error("   ❌ User A Creation DB Error:", dataA.error);

        // Second Create: User B tries to claim SAME name
        const conflictRes = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                simulated: true,
                userId: `user-B-${Date.now()}`,
                username: uniqueName,
                avatar: '🅱️'
            })
        });

        if (conflictRes.ok) {
            const data = await conflictRes.json();
            console.log("✅ Conflict handled gracefully");
            console.log("   - Verified:", data.verified);
            console.log("   - Score:", data.score);
        } else {
            console.error("❌ Conflict caused crash/error:", conflictRes.status);
        }

        // 4. Test Username Availability
        console.log("\n4. Testing Username Availability...");
        // Check taken name
        const takenRes = await fetch(`http://localhost:3000/api/user?username=${encodeURIComponent(uniqueName)}`);
        if (!takenRes.ok) {
            console.error(`Status: ${takenRes.status} ${takenRes.statusText}`);
            const text = await takenRes.text();
            console.error("Body:", text.slice(0, 200));
            return; // Stop here if failed
        }
        const takenData = await takenRes.json();
        console.log("   - Check Taken Name:", takenData.available === false ? "✅ Correct (Unavailable)" : "❌ Failed (Should be unavailable)");
        if (takenData.available) {
            console.log("     DEBUG: DB returned:", takenData.debug_user);
        }

        // Check available name
        const availRes = await fetch(`http://localhost:3000/api/user?username=Available-${Date.now()}`);
        const availData = await availRes.json();
        console.log("   - Check New Name:", availData.available === true ? "✅ Correct (Available)" : "❌ Failed (Should be available)");

    } catch (err) {
        console.error("Test execution failed:", err);
    }
}

testEndpoints();

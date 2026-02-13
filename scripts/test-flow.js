async function testFlow() {
    const { default: fetch } = await import('node-fetch');
    console.log("Testing Full UX Flow...");

    try {
        // 1. Initial State
        const initRes = await fetch('http://localhost:3000/api/leaderboard');
        const initData = await initRes.json();
        console.log("Initial Vouchers:", initData.totalVouchers);

        // 2. Simulate Success
        console.log("\nSimulating Verification...");
        const verifyRes = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                simulated: true,
                userId: 'flow-test-user',
                username: 'Flow Tester',
                avatar: '🌊'
            })
        });
        const verifyData = await verifyRes.json();
        console.log("Verification Response:", JSON.stringify(verifyData, null, 2));

        // 3. Check Rank and Vouchers
        console.log("\nChecking API for Rank and Stats...");
        const lbRes = await fetch('http://localhost:3000/api/leaderboard?userId=flow-test-user');
        const lbData = await lbRes.json();

        console.log("User Rank:", lbData.userRank);
        console.log("Total Vouchers:", lbData.totalVouchers);

        if (lbData.totalVouchers > initData.totalVouchers) {
            console.log("✅ Voucher count incremented");
        } else {
            console.error("❌ Voucher count did NOT increment");
        }

        if (typeof lbData.userRank === 'number') {
            console.log("✅ User Rank returned");
        } else {
            console.error("❌ User Rank missing");
        }

        // 4. Check Voucher List
        console.log("\nChecking Voucher List...");
        const vRes = await fetch('http://localhost:3000/api/vouchers?userId=flow-test-user');
        const vData = await vRes.json();
        const hasVoucher = vData.vouchers.some(v => v.code && v.title);

        if (hasVoucher) {
            console.log("✅ Voucher found in list");
        } else {
            console.error("❌ No voucher found for user");
        }

    } catch (err) {
        console.error("Test execution failed:", err);
    }
}

testFlow();

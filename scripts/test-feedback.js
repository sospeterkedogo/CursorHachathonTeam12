// Node 18+ has global fetch
async function testFeedback() {
    const baseUrl = 'http://localhost:3000/api/feedback';
    const testData = {
        userId: 'test-user-' + Date.now(),
        username: 'Test User',
        rating: 5,
        comment: 'This app is amazing! Verification was super fast.'
    };

    console.log('Testing Feedback POST...');
    try {
        const postRes = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        const postJson = await postRes.json();
        console.log('POST Response:', postJson);

        if (postJson.success) {
            console.log('✅ Feedback POST successful');
        } else {
            console.log('❌ Feedback POST failed');
        }

        console.log('\nTesting Feedback GET...');
        const getRes = await fetch(baseUrl);
        const getJson = await getRes.json();
        console.log('GET Response (count):', getJson.feedback?.length || 0);

        const latest = getJson.feedback?.[0];
        if (latest && latest.userId === testData.userId) {
            console.log('✅ Feedback GET successful (found latest test entry)');
        } else {
            console.log('❌ Feedback GET failed (could not find latest test entry)');
        }

    } catch (err) {
        console.error('Test failed:', err.message);
        console.log('Note: Make sure the dev server is running at http://localhost:3000');
    }
}

testFeedback();

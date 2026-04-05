
// using native fetch


async function test() {
    const signupData = {
        username: "testuser" + Math.floor(Math.random() * 1000),
        fullName: "Test User",
        email: "test" + Math.floor(Math.random() * 1000) + "@example.com",
        password: "password123"
    };

    console.log("Attempting signup...");
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
    });

    const signupJson = await signupRes.json();
    console.log("Signup Response:", signupRes.status, signupJson);

    if (signupRes.status === 201) {
        console.log("\nAttempting login...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: signupData.username,
                password: signupData.password
            })
        });

        const loginJson = await loginRes.json();
        console.log("Login Response:", loginRes.status, loginJson);
    }
}

test();

const fs = require('fs');
const ts = Date.now();
const email = `test_${ts}@example.com`;
const username = `test_${ts}`;
const password = "password123";

async function run() {
    const output = {};

    // Sign up with unique email
    let req = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Tester", email, username, password }),
    });
    output.signup = await req.json();
    output.signupStatus = req.status;

    // Log in with same credentials
    req = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    output.login = await req.json();
    output.loginStatus = req.status;

    fs.writeFileSync('login_out.json', JSON.stringify(output, null, 2));
    console.log("Signup status:", output.signupStatus, "| Login status:", output.loginStatus);
    console.log("Login success:", output.login.success);
    if (output.login.success) {
        console.log("userId:", output.login.user.id);
        console.log("token (first 30 chars):", output.login.token.slice(0, 30) + "...");
    } else {
        console.log("Error:", output.login.error);
    }
}

run().catch(console.error);

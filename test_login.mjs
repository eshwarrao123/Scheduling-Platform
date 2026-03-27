async function run() {
    console.log("Signing up...");
    let req = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Tester",
            email: "test_debug@example.com",
            username: "test_debug",
            password: "password123",
        }),
    });
    let res = await req.json();
    console.log("Signup Response:", res);

    console.log("Logging in...");
    req = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "test_debug@example.com",
            password: "password123",
        }),
    });
    res = await req.json();
    console.log("Login Response:", res);
}
run();

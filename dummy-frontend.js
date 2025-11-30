"use strict";

// Constants
const HTTP_HOST = "localhost";
const HTTP_PORT = 3000;

// Test Functions
async function createUser(user) {
    const route = "/create-user";
    const url = getUrl(HTTP_HOST, HTTP_PORT, route);
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(user);
    const response = await fetch(url, { method: method, headers: headers, body: body });

    if (response.ok) {
        const result = await response.json();

        if (result.ok) {
            console.log("Create user succeeded.");
        } else {
            console.log(`Create user failed: ${result.message}`);
        }
    } else {
        console.log("Create user failed: Unsuccessful response.");
    }
}

async function logIn(userId, password) {
    const route = "/log-in";
    const url = getUrl(HTTP_HOST, HTTP_PORT, route);
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const credentials = { userId, password };
    const body = JSON.stringify(credentials);
    const response = await fetch(url, { method: method, headers: headers, body: body });

    if (response.ok) {
        const result = await response.json();

        if (result.ok) {
            console.log("Login succeeded.");
            console.log(`Session ID returned: ${result.value}`);
        } else {
            console.log(`Login failed: ${result.message}`);
        }
    } else {
        console.log("Login failed: Unsuccessful response.");
    }
}

// Run
const user = {
    id: "user101",
    password: "12345678901234",
    name: "User 101",
    email: "user101@example.com",
};

await createUser(user);
await logIn(user.id, user.password);

// Helper Functions
function getUrl(host, port, route) {
    const urlParts = [ "http://", host, ":", port, route ];
    const url = urlParts.join("");

    return url;
}

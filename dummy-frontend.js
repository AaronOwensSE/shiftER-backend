/*
This file is an informal mockup of frontend requests. It is edited for each test and is not an
automated test set.
*/

// =================================================================================================
// Constants
// =================================================================================================
const HTTP_HOST = "localhost";
const HTTP_PORT = 3000;

// =================================================================================================
// Commands
// =================================================================================================
const user = {
    id: "user101",
    password: "12345678901234",
    name: "User 101",
    email: "user101@example.com",
};

//await createUser(user);
//await logIn(user.id, user.password);
//await restoreSession("aaf2a23b9407627dfc88f6837955ebb5d39d7a4b0b4c485583f28ae74911dc85");
await logOut("47096924cb5e165aefdf2494d3b6fa631dc273a4dae63d3d8f689a30291211ff");

// =================================================================================================
// Test Functions
// =================================================================================================
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

async function logIn(id, password) {
    const route = "/log-in";
    const url = getUrl(HTTP_HOST, HTTP_PORT, route);
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const credentials = { id, password };
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

async function restoreSession(sessionId) {
    const route = "/authenticate-session";
    const url = getUrl(HTTP_HOST, HTTP_PORT, route);
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ id: sessionId });
    const response = await fetch(url, {method: method, headers: headers, body: body});

    if (response.ok) {
        const result = await response.json();

        if (result.ok) {
            console.log("Session restored.");
        } else {
            console.log(`Restore session failed: ${result.message}`);
        }
    } else {
        console.log("Restore session failed: Unsuccessful response.");
    }
}

async function logOut(sessionId) {
    const route = "/log-out";
    const url = getUrl(HTTP_HOST, HTTP_PORT, route);
    const method = "DELETE";
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ id: sessionId });
    const response = await fetch(url, { method: method, headers: headers, body: body });

    if (response.ok) {
        const result = await response.json();

        if (result.ok) {
            console.log("Logout succeeded.");
        } else {
            console.log(`Logout failed: ${result.message}`);
        }
    } else {
        console.log("Logout failed: Unsuccessful response.");
    }
}

// =================================================================================================
// Helper Functions
// =================================================================================================
function getUrl(host, port, route) {
    const urlParts = [ "http://", host, ":", port, route ];
    const url = urlParts.join("");

    return url;
}

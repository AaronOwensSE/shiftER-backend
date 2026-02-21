import pool from "../db/pool.js";
import { testing } from "./user-controller.js";

beforeEach(async () => {
    await pool.query("BEGIN;");
});

afterEach(async () => {
    await pool.query("ROLLBACK;");
});

afterAll(async () => {
    await pool.end();
});

// Success
test("createUser: Statement Coverage 1", async () => {
    const user = {
        id: "cuSc1User",
        password: "mypassword123",
        name: "CU SC1 User",
        email: "cusc1user@example.com"
    };

    const result = await testing.createUser(user);

    expect(result.ok).toBe(true);
});

// Invalid user
test("createUser: Statement Coverage 2", async () => {
    const user = { id: 6, password: 5, name: 4, email: 3 };
    const result = await testing.createUser(user);

    expect(result.ok).toBe(false);
});

// Existing user
test("createUser: Statement Coverage 3", async () => {
    const user = {
        id: "cuSc3User",
        password: "mypassword123",
        name: "CU SC3 User",
        email: "cusc3user@example.com"
    };

    await testing.createUser(user);
    const result = await testing.createUser(user);  // Again

    expect(result.ok).toBe(false);
    expect(result.message).toBe("User already exists.");
});

/*
// Failed query
test("createUser: Statement Coverage 4", async () => {
});
*/

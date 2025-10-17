"use strict";

// Internal Modules
import crypt from "../../crypt.js";
import pool from "../pool.js";
import { testing } from "./user-model.js";

// Setup/Teardown
afterAll( async () => {
    await pool.end();
});

// Test Set
/*
Some test cases require the database to be prepared with certain data or cleared of certain data. To
keep test cases independent, we want to avoid using other functions under test to perform these
tasks. Instead, it's important that we perform these tasks manually in our test cases, using
functions not currently under test.
*/
test("createUser: Statement Coverage 1", async () => {
    // Delete user if it exists to test creation of new user.
    const id = "cuTestCase1";

    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [id]);
    } catch (error) {}

    // Create user.
    const hash = crypt.generateHash("mypassword1");
    const name = "createUser Test Case 1";
    const email = "cuTestCase1@example.com";
    const result = await testing.createUser(id, hash, name, email);

    expect(result.ok).toBe(true);
});

test("createUser: Statement Coverage 2", async () => {
    const id = null;
    const hash = crypt.generateHash("mypassword2");
    const name = "createUser Test Case 2";
    const email = "cuTestCase2@example.com";
    const result = await testing.createUser(id, hash, name, email);

    expect(result.ok).toBe(false);
});

test("readUser: Statement Coverage 1", async () => {
    // Create user to read.
    const id = "readUserTC1";
    const hash = crypt.generateHash("mypassword3");
    const name = "readUser Test Case 1";
    const email = "readUserTC1@example.com";

    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [ id, hash, name, email ]
        );
    } catch (error) {}

    // Read user.
    const result = await testing.readUser(id);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(id);
});

test("readUser: Statement Coverage 2", async () => {
    // Delete user if it exists to test read of missing user.
    const id = "readUserTC2";

    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [id]);
    } catch (error) {}

    // Read user.
    const result = await testing.readUser(id);

    expect(result.ok).toBe(false);
});

test("readUser: Statement Coverage 3", async () => {
    const id = false;
    const result = await testing.readUser(id);

    expect(result.ok).toBe(false);
});

test("updateUser: Statement Coverage 1", async () => {
    // Ensure user is available in a state that will update.
    const id = "updateUserTC1";
    const hash = crypt.generateHash("mypassword4");
    const name = "updateUser Test Case 1";
    const email = "updateUserTC1@example.com";

    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [id]);
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [ id, hash, name, email ]
        );
    } catch (error) {}

    // Update user.
    const updates = { email: "newemail@example.com" };
    const result = await testing.updateUser(id, updates);

    expect(result.ok).toBe(true);
});

test("deleteUser: Statement Coverage 1", async () => {
    // Create user to delete.
    const id = "deleteUserTC1";
    const hash = crypt.generateHash("mypassword5");
    const name = "deleteUser Test Case 1";
    const email = "deleteUserTC1@example.com";

    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [ id, hash, name, email ]
        );
    } catch (error) {}

    // Delete user.
    const result = await testing.deleteUser(id);

    expect(result.ok).toBe(true);
});

test("deleteUser: Statement Coverage 2", async () => {
    // Ensure user is already deleted.
    const id = "deleteUserTC2";

    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [id]);
    } catch (error) {}

    // Delete user.
    const result = await testing.deleteUser(id);

    expect(result.ok).toBe(false);
});

test("deleteUser: Statement Coverage 3", async () => {
    const id = null;
    const result = await testing.deleteUser(id);

    expect(result.ok).toBe(false);
});

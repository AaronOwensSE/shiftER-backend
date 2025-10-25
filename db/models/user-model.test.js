"use strict";

// Internal Modules
import pool from "../pool.js";
import { testing } from "./user-model.js";

import {
    DUMMY_USER_ID,
    DUMMY_USER_HASH,
    DUMMY_USER_NAME,
    DUMMY_USER_EMAIL,
    createDummyUser,
    deleteDummyUser
} from "./test-helpers.js";

// Setup/Teardown
afterAll( async () => {
    await pool.end();
});

/*
Transactions prevent interference from concurrent test cases in other files while allowing a shared
set of constants.
*/

beforeEach( async () => {
    await pool.query("BEGIN;");
});

afterEach( async () => {
    await pool.query("ROLLBACK;");
});

// Test Set
// Successful creation
await test("createUser: Statement Coverage 1", async () => {
    // Ensure user does not yet exist.
    await deleteDummyUser();

    // Create user.
    const result = await testing.createUser(
        DUMMY_USER_ID, DUMMY_USER_HASH, DUMMY_USER_NAME, DUMMY_USER_EMAIL
    );
    
    expect(result.ok).toBe(true);
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("createUser: Statement Coverage 2", async () => {
    const id = null;
    const result = await testing.createUser(
        id,
        DUMMY_USER_HASH,
        DUMMY_USER_NAME,
        DUMMY_USER_EMAIL
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe();
});
*/

// Successful read
test("readUser: Statement Coverage 1", async () => {
    // Create user to read.
    await deleteDummyUser();
    await createDummyUser();

    // Read user.
    const result = await testing.readUser(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(DUMMY_USER_ID);
});

// Nonexistent entry
test("readUser: Statement Coverage 2", async () => {
    // Delete user if it exists to test read of missing user.
    await deleteDummyUser();

    // Read user.
    const result = await testing.readUser(DUMMY_USER_ID);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("User does not exist.");
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("readUser: Statement Coverage 3", async () => {
    const id = null;
    const result = await testing.readUser(id);

    expect(result.ok).toBe(false);
    expect(result.message).toBe();
});
*/

// Successful update
test("updateUser: Statement Coverage 1", async () => {
    // Ensure user is available in a state that will update.
    await createDummyUser();

    // Update user.
    const updates = { email: "newemail@example.com" };
    const result = await testing.updateUser(DUMMY_USER_ID, updates);

    expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteUser: Statement Coverage 1", async () => {
    // Create user to delete.
    await createDummyUser();

    // Delete user.
    const result = await testing.deleteUser(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteUser: Statement Coverage 2", async () => {
    // Ensure user is already deleted.
    await deleteDummyUser();

    // Delete user.
    const result = await testing.deleteUser(DUMMY_USER_ID);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("User does not exist.");
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("deleteUser: Statement Coverage 3", async () => {
    const id = null;
    const result = await testing.deleteUser(id);

    expect(result.ok).toBe(false);
    expect(result.message).toBe();
});
*/

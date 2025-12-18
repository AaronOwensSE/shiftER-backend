"use strict";

import pool from "../pool.js";
import { testing } from "./session-model.js";

import {
    DUMMY_USER_ID,
    DUMMY_SESSION_ID,
    DUMMY_SESSION_EXPIRES_1,
    createDummyUser,
    createDummySession,
    createExpiredDummySession,
    deleteDummySession
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
test("createSession: Statement Coverage 1", async () => {
    // Create user for valid foreign key.
    await createDummyUser();

    // Ensure session does not yet exist.
    await deleteDummySession();

    // Create session.
    const result = await testing.createSession(
        DUMMY_SESSION_ID, DUMMY_USER_ID, DUMMY_SESSION_EXPIRES_1
    );

    expect(result.ok).toBe(true);
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Query failure
test("createSession: Statement Coverage 2", async () => {
    const id = null;
    const result = await testing.createSession(id, DUMMY_USER_ID, DUMMY_SESSION_EXPIRES);

    expect(result.ok).toBe(false);
    expect(result.message).toBe();
});
*/

// Successful read
test("readSession: Statement Coverage 1", async () => {
    // Create session.
    await createDummySession();

    // Read session.
    const result = await testing.readSession(DUMMY_SESSION_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(DUMMY_SESSION_ID);
});

// Failure to read non-existent session
test ("readSession: Statement Coverage 2", async () => {
    // Delete session.
    await deleteDummySession();

    // Read non-existent session.
    const result = await testing.readSession(DUMMY_SESSION_ID);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Session does not exist.");
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("readSession: Statement Coverage 3", async () => {
    const result = await testing.readSession(VARCHAR_FAILURE);

    expect(result.ok).toBe(false);
    expect(result.message).toBe();
});
*/

// Successful read
test("readSessionsByUserId: Statement Coverage 1", async () => {
    // Create dummy session.
    await createDummySession();

    // Read session.
    const result = await testing.readSessionsByUserId(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(DUMMY_SESSION_ID);
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("readSessionsByUserId: Statement Coverage 2", async () => {
});
*/

// Successful deletion
test("deleteSession: Statement Coverage 1", async () => {
    // Create session.
    await createDummySession();

    // Delete session.
    const result = await testing.deleteSession(DUMMY_SESSION_ID);

    expect(result.ok).toBe(true);
});

// Non-existent session deletion
test("deleteSession: Statement Coverage 2", async () => {
    // Ensure session does not exist.
    await deleteDummySession();

    // Delete non-existent session.
    const result = await testing.deleteSession(DUMMY_SESSION_ID);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Session does not exist.");
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("deleteSession: Statement Coverage 3", async () => {
});
*/

// Successful deletion
test("deleteSessionsByUserId: Statement Coverage 1", async () => {
    // Create session.
    await createDummySession();

    // Delete session.
    const result = await testing.deleteSessionsByUserId(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("deleteSessionsByUserId: Statement Coverage 2", async () => {
});
*/

// Successful deletion
test("deleteExpiredSessions: Statement Coverage 1", async () => {
    // Create session.
    await createExpiredDummySession();

    // Delete expired sessions.
    const result = await testing.deleteExpiredSessions();

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

/*
Static query makes this difficult to test.

// Failed query
test("deleteExpiredSessions: Statement Coverage 2", async () => {
});
*/

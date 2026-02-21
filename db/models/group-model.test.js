"use strict";

// Internal Modules
import pool from "../pool.js";
import { testing } from "./group-model.js";

import {
    DUMMY_GROUP_NAME,
    BAD_NUMBER,
    BAD_NUMBER_ERROR_MESSAGE,
    createDummyGroup,
    deleteDummyGroup
} from "./test-helpers.js";

// Setup/Teardown
afterAll( async () => {
    await pool.end();
});

beforeEach( async () => {
    await pool.query("BEGIN;");
});

afterEach( async () => {
    await pool.query("ROLLBACK;");
});

// Test Set
// Successful creation
test("createGroup: Statement Coverage 1", async () => {
    const result = await testing.createGroup(DUMMY_GROUP_NAME);

    expect(result.ok).toBe(true);
    expect(typeof result.value).toBe("number");
});

/*
pg's implicit type casting makes it difficult to force query failures on text-based fields using
primitive types.

// Failed query
test("createGroup: Statement Coverage 2", async () => {
});
*/

// Successful read
test("readGroup: Statement Coverage 1", async () => {
    // Create group.
    const groupId = await createDummyGroup();

    // Read group.
    const result = await testing.readGroup(groupId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(groupId);
});

// Nonexistent entry
test("readGroup: Statement Coverage 2", async () => {
    // Create group to get its ID.
    const groupId = await createDummyGroup();

    // Delete group to ensure nonexistent entry.
    await deleteDummyGroup(groupId);

    // Read group.
    const result = await testing.readGroup(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Group does not exist.");
});

// Failed query
test("readGroup: Statement Coverage 3", async () => {
    const groupId = BAD_NUMBER;
    const result = await testing.readGroup(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful update
test("updateGroup: Statement Coverage 1", async () => {
    // Create group.
    const groupId = await createDummyGroup();

    // Update group.
    const updates = { name: DUMMY_GROUP_NAME };
    const result = await testing.updateGroup(groupId, updates);

    expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteGroup: Statement Coverage 1", async () => {
    // Create group.
    const groupId = await createDummyGroup();

    // Delete group.
    const result = await testing.deleteGroup(groupId);

    expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteGroup: Statement Coverage 2", async () => {
    // Create group.
    const groupId = await createDummyGroup();

    // Delete group to ensure nonexistent entry.
    await deleteDummyGroup(groupId);

    const result = await testing.deleteGroup(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Group does not exist.");
});

// Failed query
test("deleteGroup: Statement Coverage 3", async () => {
    const groupId = BAD_NUMBER;
    const result = await testing.deleteGroup(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

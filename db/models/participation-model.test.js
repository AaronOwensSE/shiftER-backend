"use strict";

// Internal Modules
import pool from "../pool.js";
import testing from "./participation-model.js";

import {
    DUMMY_USER_ID,
    DUMMY_PARTICIPATION_TURN_ORDER,
    DUMMY_PARTICIPATION_PASSING,
    createDummyUser,
    createDummyDraft,
    createDummyParticipation,
    deleteDummyParticipation
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
test("createParticipation: Statement Coverage 1", async () => {
    // Create user.
    await createDummyUser();

    // Create draft.
    const { draftId, groupId } = await createDummyDraft();

    // Create participation.
    const result = await testing.createParticipation(
        DUMMY_USER_ID,
        draftId,
        DUMMY_PARTICIPATION_TURN_ORDER,
        DUMMY_PARTICIPATION_PASSING
    );

    expect(result.ok).toBe(true);
});

// Failed query
test("createParticipation: Statement Coverage 2", async () => {
    // Bad create query
    const draftId = "not_a_number";

    const result = await testing.createParticipation(
        DUMMY_USER_ID,
        draftId,
        DUMMY_PARTICIPATION_TURN_ORDER,
        DUMMY_PARTICIPATION_PASSING
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe("invalid input syntax for type integer: \"not_a_number\"");
});

// Successful read
test("readParticipation: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Read participation.
    const result = await testing.readParticipation(DUMMY_USER_ID, draftId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].user_id).toBe(DUMMY_USER_ID);
});

// Nonexistent entry
test("readParticipation: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const draftId = await createDummyParticipation();
    await deleteDummyParticipation(draftId);

    // Read nonexistent entry.
    const result = await testing.readParticipation(DUMMY_USER_ID, draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Participation does not exist.");
});

// Failed query
test("readParticipation: Statement Coverage 3", async () => {
    // Bad read query
    const draftId = "not_a_number";
    const result = await testing.readParticipation(DUMMY_USER_ID, draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("invalid input syntax for type integer: \"not_a_number\"");
});

// Successful read
test("readParticipationByUserId: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Read participation.
    const result = await testing.readParticipationByUserId(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].user_id).toBe(DUMMY_USER_ID);
});

/*
Typecast too robust to easily test.

// Failed query
test("readParticipationByUserId: Statement Coverage 2", async () => {
});
*/

// Successful read
test("readParticipationByDraftId: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Read participation.
    const result = await testing.readParticipationByDraftId(draftId);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

// Failed query
test("readParticipationByDraftId: Statement Coverage 2", async () => {
    // Bad read query
    const draftId = "not_a_number";
    const result = await testing.readParticipationByDraftId(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("invalid input syntax for type integer: \"not_a_number\"");
});

// Successful update
test("updateParticipation: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Update participation.
    const updates = { passing: true };
    const result = await testing.updateParticipation(DUMMY_USER_ID, draftId, updates);

    expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteParticipation: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Delete participation.
    const result = await testing.deleteParticipation(DUMMY_USER_ID, draftId);

    expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteParticipation: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const draftId = await createDummyParticipation();
    await deleteDummyParticipation(draftId);

    // Delete nonexistent entry.
    const result = await testing.deleteParticipation(DUMMY_USER_ID, draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Participation does not exist.");
});

// Failed query
test("deleteParticipation: Statement Coverage 3", async () => {
    // Bad delete query
    const draftId = "not_a_number";
    const result = await testing.deleteParticipation(DUMMY_USER_ID, draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("invalid input syntax for type integer: \"not_a_number\"");
});

// Successful deletion
test("deleteParticipationByUserId: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Delete participation.
    const result = await testing.deleteParticipationByUserId(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

/*
Typecast too robust to easily test.

// Failed query
test("deleteParticipationByUserId: Statement Coverage 2", async () => {
});
*/

// Successful deletion
test("deleteParticipationByDraftId: Statement Coverage 1", async () => {
    // Create participation.
    const draftId = await createDummyParticipation();

    // Delete participation.
    const result = await testing.deleteParticipationByDraftId(draftId);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

// Failed query
test("deleteParticipationByDraftId: Statement Coverage 2", async () => {
    // Bad delete query
    const draftId = "not_a_number";
    const result = await testing.deleteParticipationByDraftId(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("invalid input syntax for type integer: \"not_a_number\"");
});

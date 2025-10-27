"use strict";

// Internal Modules
import pool from "../pool.js";
import testing from "./draft-model.js";

import {
    DUMMY_DRAFT_START_TIME,
    DUMMY_DRAFT_END_TIME,
    DUMMY_DRAFT_ACTIVE_START_TIME,
    DUMMY_DRAFT_ACTIVE_END_TIME,
    DUMMY_DRAFT_TURN_DURATION,
    DUMMY_DRAFT_PAUSED,
    BAD_NUMBER,
    BAD_NUMBER_ERROR_MESSAGE,
    createDummyGroup,
    createDummyDraft,
    deleteDummyDraft
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
test("createDraft: Statement Coverage 1", async () => {
    // Create group.
    const groupId = await createDummyGroup();

    // Create draft.
    const result = await testing.createDraft(
        DUMMY_DRAFT_START_TIME,
        DUMMY_DRAFT_END_TIME,
        DUMMY_DRAFT_ACTIVE_START_TIME,
        DUMMY_DRAFT_ACTIVE_END_TIME,
        DUMMY_DRAFT_TURN_DURATION,
        DUMMY_DRAFT_PAUSED,
        groupId
    );

    expect(result.ok).toBe(true);
    expect(typeof result.value).toBe("number");
});

// Failed query
test("createDraft: Statement Coverage 2", async () => {
    // Bad create query.
    const groupId = BAD_NUMBER;
    const result = await testing.createDraft(
        DUMMY_DRAFT_START_TIME,
        DUMMY_DRAFT_END_TIME,
        DUMMY_DRAFT_ACTIVE_START_TIME,
        DUMMY_DRAFT_ACTIVE_END_TIME,
        DUMMY_DRAFT_TURN_DURATION,
        DUMMY_DRAFT_PAUSED,
        groupId
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readDraft: Statement Coverage 1", async () => {
    // Create draft.
    const { draftId, groupId } = await createDummyDraft();

    // Read draft.
    const result = await testing.readDraft(draftId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(draftId);
});

// Nonexistent entry
test("readDraft: Statement Coverage 2", async () => {
    // Delete draft.
    const { draftId, groupId } = await createDummyDraft();
    await deleteDummyDraft(draftId);

    // Read nonexistent entry.
    const result = await testing.readDraft(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Draft does not exist.");
});

// Failed query
test("readDraft: Statement Coverage 3", async () => {
    // Bad read query.
    const draftId = BAD_NUMBER;
    const result = await testing.readDraft(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readDraftsByGroupId: Statement Coverage 1", async () => {
    // Create draft.
    const { draftId, groupId } = await createDummyDraft();

    // Read drafts.
    const result = await testing.readDraftsByGroupId(groupId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(draftId);
});

// Failed query
test("readDraftsByGroupId: Statement Coverage 2", async () => {
    // Bad read query.
    const groupId = BAD_NUMBER;
    const result = await testing.readDraftsByGroupId(groupId);
    
    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful update
test("updateDraft: Statement Coverage 1", async () => {
    // Create draft.
    const { draftId, groupId } = await createDummyDraft();

    // Update draft.
    const updates = { paused: true }
    const result = await testing.updateDraft(draftId, updates);

    expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteDraft: Statement Coverage 1", async () => {
    // Create draft.
    const { draftId, groupId } = await createDummyDraft();

    // Delete draft.
    const result = await testing.deleteDraft(draftId);

    expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteDraft: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const { draftId, groupId } = await createDummyDraft();
    await deleteDummyDraft(draftId);

    // Delete nonexistent entry.
    const result = await testing.deleteDraft(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Draft does not exist.");
});

// Failed query
test("deleteDraft: Statement Coverage 3", async () => {
    // Bad delete query
    const draftId = BAD_NUMBER;
    const result = await testing.deleteDraft(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful deletion
test("deleteDraftsByGroupId: Statement Coverage 1", async () => {
    // Create draft.
    const { draftId, groupId } = await createDummyDraft();

    // Delete draft.
    const result = await testing.deleteDraftsByGroupId(groupId);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

// Failed query
test("deleteDraftsByGroupId: Statement Coverage 2", async () => {
    const groupId = BAD_NUMBER;
    const result = await testing.deleteDraftsByGroupId(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

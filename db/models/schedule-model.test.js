"use strict";

// Internal Modules
import pool from "../pool.js";
import testing from "./schedule-model.js";

import {
    DUMMY_SCHEDULE_START_DATE,
    DUMMY_SCHEDULE_END_DATE,
    BAD_NUMBER,
    BAD_NUMBER_ERROR_MESSAGE,
    createDummyDraft,
    createDummySchedule,
    deleteDummySchedule
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
test("createSchedule: Statement Coverage 1", async () => {
    // Create group and draft.
    const { draftId, groupId } = await createDummyDraft();

    // Create schedule.
    const result = await testing.createSchedule(
        DUMMY_SCHEDULE_START_DATE, DUMMY_SCHEDULE_END_DATE, groupId, draftId
    );

    expect(result.ok).toBe(true);
    expect(typeof result.value).toBe("number");
});

// Failed query
test("createSchedule: Statement Coverage 2", async () => {
    // Bad create query
    const draftId = BAD_NUMBER;
    const groupId = BAD_NUMBER;
    const result = await testing.createSchedule(
        DUMMY_SCHEDULE_START_DATE, DUMMY_SCHEDULE_END_DATE, groupId, draftId
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readSchedule: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Read schedule.
    const result = await testing.readSchedule(scheduleId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(scheduleId);
});

// Nonexistent entry
test("readSchedule: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const { scheduleId, draftId, groupId } = await createDummySchedule();
    await deleteDummySchedule(scheduleId);

    // Read nonexistent entry.
    const result = await testing.readSchedule(scheduleId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Schedule does not exist.");
});

// Failed query
test("readSchedule: Statement Coverage 3", async () => {
    // Bad read query
    const scheduleId = BAD_NUMBER;
    const result = await testing.readSchedule(scheduleId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readSchedulesByGroupId: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Read schedule.
    const result = await testing.readSchedulesByGroupId(groupId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].group_id).toBe(groupId);
});

// Failed query
test("readSchedulesByGroupId: Statement Coverage 2", async () => {
    // Bad read query
    const groupId = BAD_NUMBER;
    const result = await testing.readSchedulesByGroupId(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readSchedulesByDraftId: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Read schedule.
    const result = await testing.readSchedulesByDraftId(draftId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].draft_id).toBe(draftId);
});

// Failed query
test("readSchedulesByDraftId: Statement Coverage 2", async () => {
    // Bad read query
    const draftId = BAD_NUMBER;
    const result = await testing.readSchedulesByDraftId(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful update
test("updateSchedule: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Update schedule.
    const updates = { end_date: "NOW()" };
    const result = await testing.updateSchedule(scheduleId, updates);

    expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteSchedule: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Delete schedule.
    const result = await testing.deleteSchedule(scheduleId);

    expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteSchedule: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const { scheduleId, draftId, groupIpd } = await createDummySchedule();
    await deleteDummySchedule(scheduleId);

    // Read nonexistent entry.
    const result = await testing.deleteSchedule(scheduleId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Schedule does not exist.");
});

// Failed query
test("deleteSchedule: Statement Coverage 3", async () => {
    // Bad delete query
    const scheduleId = BAD_NUMBER;
    const result = await testing.deleteSchedule(scheduleId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful deletion
test("deleteSchedulesByGroupId: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Delete schedule.
    const result = await testing.deleteSchedulesByGroupId(groupId);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

// Failed query
test("deleteSchedulesByGroupId: Statement Coverage 2", async () => {
    // Bad delete query
    const groupId = BAD_NUMBER;
    const result = await testing.deleteSchedulesByGroupId(groupId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful deletion
test("deleteSchedulesByDraftId: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Delete schedule.
    const result = await testing.deleteSchedulesByDraftId(draftId);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

// Failed query
test("deleteSchedulesByDraftId: Statement Coverage 2", async () => {
    // Bad delete query
    const draftId = BAD_NUMBER;
    const result = await testing.deleteSchedulesByDraftId(draftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

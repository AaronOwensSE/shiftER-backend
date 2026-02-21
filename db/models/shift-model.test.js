"use strict";

// Internal Modules
import pool from "../pool.js";
import { testing } from "./shift-model.js";

import {
    DUMMY_USER_ID,
    DUMMY_SHIFT_START_TIME,
    DUMMY_SHIFT_END_TIME,
    BAD_NUMBER,
    BAD_NUMBER_ERROR_MESSAGE,
    createDummySchedule,
    createDummyShift,
    deleteDummyShift
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
test("createShift: Statement Coverage 1", async () => {
    // Create schedule.
    const { scheduleId, draftId, groupId } = await createDummySchedule();

    // Create shift.
    const result = await testing.createShift(
        DUMMY_SHIFT_START_TIME, DUMMY_SHIFT_END_TIME, scheduleId
    );

    expect(result.ok).toBe(true);
    expect(typeof result.value).toBe("number");
});

// Failed query
test("createShift: Statement Coverage 2", async () => {
    // Bad create query
    const scheduleId = BAD_NUMBER;

    const result = await testing.createShift(
        DUMMY_SHIFT_START_TIME, DUMMY_SHIFT_END_TIME, scheduleId
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readShift: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Read shift.
    const result = await testing.readShift(shiftId);
    
    expect(result.ok).toBe(true);
    expect(result.value.rows[0].id).toBe(shiftId);
});

// Nonexistent entry
test("readShift: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const { shiftId, scheduleId } = await createDummyShift();
    await deleteDummyShift(shiftId);

    // Read nonexistent entry.
    const result = await testing.readShift(shiftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Shift does not exist.");
});

// Failed query
test("readShift: Statement Coverage 3", async () => {
    // Bad read query
    const shiftId = BAD_NUMBER;
    const result = await testing.readShift(shiftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readShiftsByScheduleId: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Read shift.
    const result = await testing.readShiftsByScheduleId(scheduleId);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].schedule_id).toBe(scheduleId);
});

// Failed query
test("readShiftsByScheduleId: Statement Coverage 2", async () => {
    // Bad read query
    const scheduleId = BAD_NUMBER;
    const result = await testing.readShiftsByScheduleId(scheduleId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readShiftsByUserId: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Read shift.
    const result = await testing.readShiftsByUserId(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rows[0].user_id).toBe(DUMMY_USER_ID);
});

/*
Typecast too robust to easily test.

// Failed query
test("readShiftsByUserId: Statement Coverage 2", async () => {
});
*/

// Successful update
test("updateShift: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Update shift.
    const updates = { end_time: "NOW()" };
    const result = await testing.updateShift(shiftId, updates);

    expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteShift: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Delete shift.
    const result = await testing.deleteShift(shiftId);

    expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteShift: Statement Coverage 2", async () => {
    // Ensure nonexistent entry.
    const { shiftId, scheduleId } = await createDummyShift();
    await deleteDummyShift(shiftId);

    // Delete nonexistent entry.
    const result = await testing.deleteShift(shiftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Shift does not exist.");
});

// Failed query
test("deleteShift: Statement Coverage 3", async () => {
    // Bad delete query
    const shiftId = BAD_NUMBER;
    const result = await testing.deleteShift(shiftId);

    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful deletion
test("deleteShiftsByScheduleId: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Delete shifts.
    const result = await testing.deleteShiftsByScheduleId(scheduleId);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

// Failed query
test("deleteShiftsByScheduleId: Statement Coverage 2", async () => {
    // Bad delete query
    const scheduleId = BAD_NUMBER;
    const result = await testing.deleteShiftsByScheduleId(scheduleId);
    
    expect(result.ok).toBe(false);
    expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful deletion
test("deleteShiftsByUserId: Statement Coverage 1", async () => {
    // Create shift.
    const { shiftId, scheduleId } = await createDummyShift();

    // Delete shifts.
    const result = await testing.deleteShiftsByUserId(DUMMY_USER_ID);

    expect(result.ok).toBe(true);
    expect(result.value.rowCount).toBe(1);
});

/*
Typecast too robust to easily test.

// Failed query
test("deleteShiftsByUserId: Statement Coverage 2", async () => {
});
*/

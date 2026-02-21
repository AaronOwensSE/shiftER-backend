"use strict";

// Internal Modules
import pool from "../pool.js";
import { testing } from "./membership-model.js";

import {
    DUMMY_USER_ID,
    DUMMY_MEMBERSHIP_ADMIN,
	BAD_NUMBER,
	BAD_NUMBER_ERROR_MESSAGE,
    createDummyUser,
    createDummyGroup,
    createDummyMembership,
    deleteDummyMembership
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
test("createMembership: Statement Coverage 1", async () => {
    // Create user.
	await createDummyUser();
	
    // Create group.
	const groupId = await createDummyGroup();

    // Create membership.
	const result = await testing.createMembership(DUMMY_USER_ID, groupId, DUMMY_MEMBERSHIP_ADMIN);
	
	expect(result.ok).toBe(true);
});

// Failed query
test("createMembership: Statement Coverage 2", async () => {
    // Create user.
	await createDummyUser();
	
    // Bad create query.
	const groupId = null;
	const result = await testing.createMembership(DUMMY_USER_ID, groupId, DUMMY_MEMBERSHIP_ADMIN);
	
	expect(result.ok).toBe(false);

	expect(result.message).toBe(
        "null value in column \"group_id\" of relation \"memberships\" violates not-null constraint"
    );
});

// Successful read
test("readMembership: Statement Coverage 1", async () => {
    // Create membership.
	const groupId = await createDummyMembership();
	
    // Read membership.
	const result = await testing.readMembership(DUMMY_USER_ID, groupId);
	
	expect(result.ok).toBe(true);
	expect(result.value.rows[0].user_id).toBe(DUMMY_USER_ID);
});

// Nonexistent entry
test("readMembership: Statement Coverage 2", async () => {
    // Ensure nonexistent membership.
	const groupId = await createDummyMembership();
	await deleteDummyMembership(groupId);
	
    // Read membership.
	const result = await testing.readMembership(DUMMY_USER_ID, groupId);
	
	expect(result.ok).toBe(false);
	expect(result.message).toBe("Membership does not exist.");
});

// Failed query
test("readMembership: Statement Coverage 3", async () => {
    // Bad read query.
	const groupId = BAD_NUMBER;
	const result = await testing.readMembership(DUMMY_USER_ID, groupId);
	
	expect(result.ok).toBe(false);
	expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful read
test("readMembershipsByUserId: Statement Coverage 1", async () => {
    // Create membership.
	const groupId = await createDummyMembership();
	
    // Read memberships.
	const result = await testing.readMembershipsByUserId(DUMMY_USER_ID);
	
	expect(result.ok).toBe(true);
	expect(result.value.rows[0].user_id).toBe(DUMMY_USER_ID);
});

/*
// Failed query
test("readMembershipsByUserId: Statement Coverage 2", () => {
});
*/

// Successful read
test("readMembershipsByGroupId: Statement Coverage 1", async () => {
    // Create membership.
	const groupId = await createDummyMembership();
	
    // Read memberships.
	const result = await testing.readMembershipsByGroupId(groupId);
	
	expect(result.ok).toBe(true);
	expect(result.value.rows[0].group_id).toBe(groupId);
});

// Failed query
test("readMembershipsByGroupId: Statement Coverage 2", async () => {
    // Bad read query.
	const groupId = BAD_NUMBER;
	const result = await testing.readMembershipsByGroupId(groupId);
	
	expect(result.ok).toBe(false);
	expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful update
test("updateMembership: Statement Coverage 1", async () => {
    // Create membership.
	const groupId = await createDummyMembership();
	
    // Update membership.
	const updates = { admin: true };
	const result = await testing.updateMembership(DUMMY_USER_ID, groupId, updates);
	
	expect(result.ok).toBe(true);
});

// Successful deletion
test("deleteMembership: Statement Coverage 1", async () => {
    // Create membership.
	const groupId = await createDummyMembership();
	
    // Delete membership.
	const result = await testing.deleteMembership(DUMMY_USER_ID, groupId);
	
	expect(result.ok).toBe(true);
});

// Nonexistent entry
test("deleteMembership: Statement Coverage 2", async () => {
    // Ensure nonexistent membership.
	const groupId = await createDummyMembership();
	await deleteDummyMembership(groupId);
	
    // Delete membership.
	const result = await testing.deleteMembership(DUMMY_USER_ID, groupId);
	
	expect(result.ok).toBe(false);
	expect(result.message).toBe("Membership does not exist.");
});

// Failed query
test("deleteMembership: Statement Coverage 3", async () => {
    // Bad delete query.
	const groupId = BAD_NUMBER;
	const result = await testing.deleteMembership(DUMMY_USER_ID, groupId);
	
	expect(result.ok).toBe(false);
	expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

// Successful deletion
test("deleteMembershipsByUserId: Statement Coverage 1", async () => {
    // Create membership.
	await createDummyMembership();
	
    // Delete memberships.
	const result = await testing.deleteMembershipsByUserId(DUMMY_USER_ID);
	
	expect(result.ok).toBe(true);
	expect(result.value.rowCount).toBe(1);
});

/*
// Failed query
test("deleteMembershipsByUserId: Statement Coverage 2", () => {
});
*/

// Successful deletion
test("deleteMembershipsByGroupId: Statement Coverage 1", async () => {
    // Create membership.
	const groupId = await createDummyMembership();
	
    // Delete memberships.
	const result = await testing.deleteMembershipsByGroupId(groupId);
	
	expect(result.ok).toBe(true);
	expect(result.value.rowCount).toBe(1);
});

// Failed query
test("deleteMembershipsByGroupId: Statement Coverage 2", async () => {
    // Bad delete query.
	const groupId = BAD_NUMBER;
	const result = await testing.deleteMembershipsByGroupId(groupId);
	
	expect(result.ok).toBe(false);
	expect(result.message).toBe(BAD_NUMBER_ERROR_MESSAGE);
});

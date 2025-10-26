"use strict";

/*
These are primarily database setup functions for use by individual test cases. We want to avoid
calling functions that are currently under test to perform setup, so we write the interactions
manually here.

As with our test cases, we want to keep these as simple as possible so that we do not fall into the
trap of having to perform further testing on our testing code.
*/

// Internal Modules
import crypt from "../../crypt.js";
import pool from "../pool.js";

// Constants
// Users
export const DUMMY_USER_ID = "dummy_user";
export const DUMMY_USER_HASH = await crypt.generateHash("dummy_password_1");
export const DUMMY_USER_NAME = "Dummy User";
export const DUMMY_USER_EMAIL = "dummy_user@example.com";

// Sessions
export const DUMMY_SESSION_ID = "dummy_session_id_1234";
const date1 = new Date();
date1.setDate(new Date().getDate() + 7);
export const DUMMY_SESSION_EXPIRES_1 = date1.toISOString();
const date2 = new Date();
date2.setDate(new Date().getDate() - 7);
export const DUMMY_SESSION_EXPIRES_2 = date2.toISOString();

// Groups
export const DUMMY_GROUP_NAME = "dummy_group";

// Memberships
export const DUMMY_MEMBERSHIP_ADMIN = false;

// Drafts
export const DUMMY_DRAFT_START_TIME = "NOW()";
export const DUMMY_DRAFT_END_TIME = "NOW()";
export const DUMMY_DRAFT_ACTIVE_START_TIME = "NOW()";
export const DUMMY_DRAFT_ACTIVE_END_TIME = "NOW()";
export const DUMMY_DRAFT_TURN_DURATION = "1 hour 30 minutes";
export const DUMMY_DRAFT_PAUSED = false;

// Participation
export const DUMMY_PARTICIPATION_TURN_ORDER = 1;
export const DUMMY_PARTICIPATION_PASSING = false;

// Schedules
export const DUMMY_SCHEDULE_START_DATE = "NOW()";
export const DUMMY_SCHEDULE_END_DATE = "NOW()";

// Functions
export async function createDummyUser() {
    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [ DUMMY_USER_ID, DUMMY_USER_HASH, DUMMY_USER_NAME, DUMMY_USER_EMAIL ]
        );
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteDummyUser() {
    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [DUMMY_USER_ID]);
    } catch (error) {
        console.log(error.message);
    }
}

export async function createDummySession() {
    await createDummyUser();

    try {
        await pool.query(
            "INSERT INTO sessions (id, expires, user_id) VALUES ($1, $2, $3);",
            [ DUMMY_SESSION_ID, DUMMY_SESSION_EXPIRES_1, DUMMY_USER_ID ]
        );
    } catch (error) {
        console.log(error.message);
    }
}

export async function createExpiredDummySession() {
    await createDummyUser();

    try {
        await pool.query(
            "INSERT INTO sessions (id, expires, user_id) VALUES ($1, $2, $3);",
            [ DUMMY_SESSION_ID, DUMMY_SESSION_EXPIRES_2, DUMMY_USER_ID ]);
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteDummySession() {
    try {
        await pool.query("DELETE FROM sessions WHERE id = $1;", [DUMMY_SESSION_ID]);
    } catch (error) {
        console.log(error.message);
    }
}

export async function createDummyGroup() {
    try {
        const queryResult = await pool.query(
            "INSERT INTO groups (name) VALUES ($1) RETURNING (id);",
            [DUMMY_GROUP_NAME]
        );

        const groupId = queryResult.rows[0].id;

        return groupId;
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteDummyGroup(groupId) {
    try {
        await pool.query("DELETE FROM groups WHERE id = $1;", [groupId]);
    } catch (error) {
        console.log(error.message);
    }
}

export async function createDummyMembership() {
    await createDummyUser();
    const groupId = await createDummyGroup();

    try {
        await pool.query(
            "INSERT INTO memberships (user_id, group_id, admin) VALUES ($1, $2, $3);",
            [ DUMMY_USER_ID, groupId, DUMMY_MEMBERSHIP_ADMIN ]
        );

        return groupId;
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteDummyMembership(groupId) {
    try {
        await pool.query(
            "DELETE FROM memberships WHERE user_id = $1 AND group_id = $2;",
            [ DUMMY_USER_ID, groupId ]
        );
    } catch (error) {
        console.log(error.message);
    }
}

export async function createDummyDraft() {
    const groupId = await createDummyGroup();

    try {
        const queryResult = await pool.query(
            `INSERT INTO drafts (
				start_time,
				end_time,
				active_start_time,
				active_end_time,
				turn_duration,
				paused,
				group_id
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING (id);`,
            [
                DUMMY_DRAFT_START_TIME,
                DUMMY_DRAFT_END_TIME,
                DUMMY_DRAFT_ACTIVE_START_TIME,
                DUMMY_DRAFT_ACTIVE_END_TIME,
                DUMMY_DRAFT_TURN_DURATION,
                DUMMY_DRAFT_PAUSED,
                groupId
            ]
        );

        const draftId = queryResult.rows[0].id;

        return { draftId, groupId };
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteDummyDraft(draftId) {
    try {
        await pool.query("DELETE FROM drafts WHERE id = $1;", [draftId]);
    } catch (error) {
        console.log(error.message);
    }
}

export async function createDummyParticipation() {
    await createDummyUser();
    const { draftId, groupId } = await createDummyDraft();

    try {
        await pool.query(
            `INSERT INTO participation (user_id, draft_id, turn_order, passing)
            VALUES ($1, $2, $3, $4);`,
            [ DUMMY_USER_ID, draftId, DUMMY_PARTICIPATION_TURN_ORDER, DUMMY_PARTICIPATION_PASSING ]
        );

        return draftId;
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteDummyParticipation(draftId) {
    try {
        await pool.query(
            "DELETE FROM participation WHERE user_id = $1 AND draft_id = $2;",
            [ DUMMY_USER_ID, draftId ]
        );
    } catch (error) {
        console.log(error.message);
    }
}

export async function createDummySchedule() {
    const { draftId, groupId } = await createDummyDraft();

    try {
		const queryResult = await pool.query(
            `INSERT INTO schedules (start_date, end_date, group_id, draft_id)
            VALUES ($1, $2, $3, $4) RETURNING (id);`,
            [ DUMMY_SCHEDULE_START_DATE, DUMMY_SCHEDULE_END_DATE, groupId, draftId ]
        );

        const scheduleId = queryResult.rows[0].id;

        return { scheduleId, groupId, draftId };
	} catch (error) {
		console.log(error.message);
	}
}

export async function deleteDummySchedule(scheduleId) {
    try {
        await pool.query("DELETE FROM schedules WHERE id = $1;", [scheduleId]);
    } catch (error) {
        console.log(error.message);
    }
}

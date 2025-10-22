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
export const DUMMY_USER_ID = "dummy_user";
export const DUMMY_USER_HASH = crypt.generateHash("dummy_password_1");
export const DUMMY_USER_NAME = "Dummy User";
export const DUMMY_USER_EMAIL = "dummy_user@example.com";

export const DUMMY_SESSION_ID = "dummy_session_id_1234";
const date1 = new Date();
date1.setDate(new Date().getDate() + 7);
export const DUMMY_SESSION_EXPIRES_1 = date1.toISOString();
const date2 = new Date();
date2.setDate(new Date().getDate() - 7);
export const DUMMY_SESSION_EXPIRES_2 = date2.toISOString();

export const DUMMY_GROUP_NAME = "dummy_group";

// Functions
export async function createDummyUser() {
    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [ DUMMY_USER_ID, DUMMY_USER_HASH, DUMMY_USER_NAME, DUMMY_USER_EMAIL ]
        );
    } catch (error) {}
}

export async function deleteDummyUser() {
    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [DUMMY_USER_ID]);
    } catch (error) {}
}

export async function createDummySession() {
    try {
        await createDummyUser();

        await pool.query(
            "INSERT INTO sessions (id, expires, user_id) VALUES ($1, $2, $3);",
            [ DUMMY_SESSION_ID, DUMMY_SESSION_EXPIRES_1, DUMMY_USER_ID ]
        );
    } catch (error) {}
}

export async function createExpiredDummySession() {
    try {
        await createDummyUser();

        await pool.query(
            "INSERT INTO sessions (id, expires, user_id) VALUES ($1, $2, $3);",
            [ DUMMY_SESSION_ID, DUMMY_SESSION_EXPIRES_2, DUMMY_USER_ID ]);
    } catch (error) {}
}

export async function deleteDummySession() {
    try {
        await pool.query("DELETE FROM sessions WHERE id = $1;", [DUMMY_SESSION_ID]);
    } catch (error) {}
}

export async function createDummyGroup() {
    try {
        const queryResult = await pool.query(
            "INSERT INTO groups (name) VALUES ($1) RETURNING (id);",
            [DUMMY_GROUP_NAME]
        );

        const groupId = queryResult.rows[0].id;

        return groupId;
    } catch (error) {}
}

export async function deleteDummyGroup(groupId) {
    try {
        await pool.query("DELETE FROM groups WHERE id = $1;", [groupId]);
    } catch (error) {}
}

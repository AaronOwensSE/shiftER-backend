"use strict";

// Internal Modules
import Result from "../../error-handling.js";
import pool from "../pool.js";

// Exports
async function createSession(id, userId, expires) {
    let result = new Result;

    try {
        await pool.query(
            "INSERT INTO sessions (id, user_id, expires) VALUES ($1, $2, $3);",
            [id, userId, expires]
        );

        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readSession(id) {
    let result = new Result();

    try {
        const queryResult = await pool.query("SELECT * FROM sessions WHERE id = $1;", [id]);
        result.ok = true;
        result.value = queryResult;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function deleteSession(id) {
    let result = new Result();

    try {
        const queryResult = await pool.query("DELETE FROM sessions WHERE id = $1;", [id]);

        if (queryResult.rowCount > 0) {
            result.ok = true;
        } else {
            result.ok = false;
            result.message = "Session does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function deleteUserSessions(userId) {
    let result = new Result();

    try {
        await pool.query("DELETE FROM sessions WHERE user_id = $1;", [userId]);
        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function deleteExpiredSessions() {
    let result = new Result();

    try {
        await pool.query("DELETE FROM sessions WHERE expires < NOW();");
        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

const sessionModel = {
    createSession,
    readSession,
    deleteSession,
    deleteUserSessions,
    deleteExpiredSessions
};

export default sessionModel;

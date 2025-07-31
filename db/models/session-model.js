"use strict";

// External Dependencies
import "crypto";

// Internal Modules
import pool from "../pool.js";

// Exports
async function createSession(id, userId, expires) {
    console.log(`Create session: ${id}`);

    try {
        await pool.query(
            "INSERT INTO sessions (id, user_id, expires) VALUES ($1, $2, $3);",
            [id, userId, expires]
        );
    } catch (error) {
        console.error(`Create session failed: ${error.message}`);

        return false;
    }
    console.log("Create session succeeded.");

    return true;
}

async function readSession(id) {
    console.log(`Read session ID: ${id}`);

    try {
        const result = await pool.query("SELECT * FROM sessions WHERE id = $1;", [id]);
        console.log("Read session ID succeeded.");

        return result;
    } catch (error) {
        console.error(`Read session ID failed: ${error.message}`);

        throw Error("Query failed.");
    }
}

async function deleteSession(id) {
    console.log(`Delete session: ${id}`);

    try {
        const result = await pool.query("DELETE FROM sessions WHERE id = $1;", [id]);

        if (result.rowCount > 0) {
            console.log("Delete session succeeded.");

            return true;
        } else {
            console.error("Delete session failed: Session does not exist.");

            return false;
        }
    } catch (error) {
        console.error(`Delete session failed: ${error.message}`);

        return false;
    }
}

async function deleteExpiredSessions() {
    console.log("Delete expired sessions.");

    try {
        const result = await pool.query("DELETE FROM sessions WHERE expires < NOW();");

        if (result.rowCount > 0) {
            console.log("Delete expired sessions succeeded.");

            return true;
        } else {
            console.error("Delete expired sessions failed: No expired sessions.");

            return false;
        }
    } catch (error) {
        console.error(`Delete expired sessions failed: ${error.message}`);

        return false;
    }
}

const sessionModel = { createSession, readSession, deleteSession, deleteExpiredSessions };
export default sessionModel;

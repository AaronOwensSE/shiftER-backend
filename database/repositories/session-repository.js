// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import databaseErrors from "../database-errors.js";
import pool from "../pool.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createSession(sessionId, userId, expires) {
    try {
        await pool.query(
            "INSERT INTO sessions (id, user_id, expires) VALUES ($1, $2, $3);",
            [sessionId, userId, expires]
        );
    } catch (error) {
        if (error.code === constants.UNIQUE_CONSTRAINT_VIOLATION_CODE) {
            throw new databaseErrors.EntryAlreadyExistsError();
        } else {
            throw error;
        }
    }
}

async function readUserIdFromActiveSession(sessionId) {
    const now = new Date(Date.now());

    const result = await pool.query(
        "SELECT user_id FROM sessions WHERE id = $1 AND expires > $2;", [sessionId, now]
    );

    if (result.rowCount === 0) {
        throw new databaseErrors.EntryDoesNotExistError();
    }

    const userId = result.rows[0].user_id;

    return userId;
}

async function deleteSession(sessionId) {
    const result = await pool.query("DELETE FROM sessions WHERE id = $1;", [sessionId]);

    if (result.rowCount === 0) {
        throw new databaseErrors.EntryDoesNotExistError();
    }
}

async function deleteSessionsByUserId(userId) {
    const result = await pool.query("DELETE FROM sessions WHERE user_id = $1;", [userId]);

    if (result.rowCount === 0) {
        throw new databaseErrors.EntryDoesNotExistError();
    }
}

const sessionRepository = {
    createSession,
    readUserIdFromActiveSession,
    deleteSession,
    deleteSessionsByUserId
};

export default sessionRepository;

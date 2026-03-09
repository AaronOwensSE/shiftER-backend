// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import pool from "./pool.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createSession(id, userId, expires) {
    try {
        await pool.query(
            "INSERT INTO sessions (id, user_id, expires) VALUES ($1, $2, $3);",
            [id, userId, expires]
        );
    } catch (error) {
        if (error.code === "23505") {   // Unique constraint violation
            throw new errors.ResourceAlreadyExistsError();
        } else {
            throw error;
        }
    }

    return id;
}

const sessionModel = { createSession };
export default sessionModel;

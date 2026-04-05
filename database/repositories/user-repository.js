// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import databaseErrors from "../database-errors.js";
import pool from "../pool.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser({ id, hash, name, email }) {
    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [ id, hash, name, email ]
        );
    } catch (error) {
        if (error.code === constants.UNIQUE_CONSTRAINT_VIOLATION_CODE) {
            throw new databaseErrors.EntryAlreadyExistsError();
        } else {
            throw error;
        }
    }
}

async function readUser(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    
    if (result.rowCount === 0) {
        throw new databaseErrors.EntryDoesNotExistError();
    }

    const user = result.rows[0];

    return user;
}

async function deleteUser(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1;", [id]);

    if (result.rowCount === 0) {
        throw new databaseErrors.EntryDoesNotExistError();
    }
}

const userRepository = { createUser, readUser, deleteUser };
export default userRepository;

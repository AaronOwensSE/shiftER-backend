// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../../errors.js";
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
        if (error.code === "23505") {   // Unique constraint violation
            throw new errors.ResourceAlreadyExistsError();
        } else {
            throw error;
        }
    }

    return id;
}

async function readUser(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    
    if (result.rowCount === 0) {
        throw new errors.ResourceDoesNotExistError();
    }

    const user = result.rows[0];

    return user;
}

async function deleteUser(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1;", [id]);

    if (result.rowCount === 0) {
        throw new errors.ResourceDoesNotExistError();
    }

    return true;    // Useful for testing.
}

const userRepository = { createUser, readUser, deleteUser };
export default userRepository;

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";
import updateQuery from "./update-query.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser({ id, hash, name, email }) {
    let result = new errorHandling.Result();

    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [id, hash, name, email]
        );

        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readUser(id) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);

        if (queryResult.rowCount > 0) {
            result.ok = true;
            result.value = queryResult;
        } else {
            result.ok = false;
            result.message = "User does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function updateUser(id, updates) {
    const result = updateQuery("users", { id }, updates);

    return result;
}

async function deleteUser(id) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query("DELETE FROM users WHERE id = $1;", [id]);

        if (queryResult.rowCount > 0) {
            result.ok = true;
        } else {
            result.ok = false;
            result.message = "User does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

const userModel = { createUser, readUser, updateUser, deleteUser };
export default userModel;

export const testing =
    process.env.NODE_ENV === "test" ?
    { createUser, readUser, updateUser, deleteUser }
    : {};

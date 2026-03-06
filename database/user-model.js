// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import pool from "./pool.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser({ id, hash, name, email }) {
    const result = await pool.query(
        "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
        [ id, hash, name, email ]
    );

    if (result.rowCount == 0) {
        throw new errors.ResourceAlreadyExistsError();
    }
}

const userModel = { createUser };
export default userModel;

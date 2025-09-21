"use strict";

// Internal Modules
import Result from "../../error-handling.js";
import pool from "../pool.js";

// Exports
async function createUser(id, hash, name, email) {
    let result = new Result();

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
    let result = new Result();

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
    let result = new Result();

    if (!isValidUpdate(updates)) {
        result.ok = false;
        result.message = "Invalid update.";

        return result;
    }

    const fieldNames = Object.keys(updates);
    const updateQuery = buildUpdateQuery(fieldNames);

    const fieldValues = Object.values(updates);
    const updateParams = buildUpdateParams(id, fieldValues);

    try {
        const queryResult = await pool.query(updateQuery, updateParams);

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

async function deleteUser(id) {
    let result = new Result();

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

// Helper Functions
function isValidUpdate(updates) {
    return updates.hash || updates.name || updates.email;
}

function buildUpdateQuery(fieldNames) {
    let updateQueryParts = [];
    updateQueryParts.push("UPDATE users");
    pushSetClause(updateQueryParts, fieldNames);
    updateQueryParts.push("WHERE id = $1;");

    const updateQuery = updateQueryParts.join(" ");

    return updateQuery;
}

function pushSetClause(updateQueryParts, fieldNames) {
    updateQueryParts.push("SET");
    const fieldSettings = buildFieldSettings(fieldNames);
    updateQueryParts.push(fieldSettings);
}

function buildFieldSettings(fieldNames) {
    let fieldSettingsParts = [];

    for (let i = 0; i < fieldNames.length; i++) {
        fieldSettingsParts.push(`${fieldNames[i]} = $${i + 2}`);
    }

    // Although we are trying to maintain O(n) concatenation, the need for a different delimiter on
    // this substring makes a second join in the buildUpdateQuery call stack acceptable.
    const fieldSettings = fieldSettingsParts.join(", ");

    return fieldSettings;
}

function buildUpdateParams(id, fieldValues) {
    let updateParams = [];
    updateParams.push(id);
    updateParams.push(...fieldValues);

    return updateParams;
}

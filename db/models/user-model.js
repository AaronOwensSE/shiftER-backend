"use strict";

// Internal Modules
import pool from "../pool.js";

// Exports
async function createUser(id, hash, name, email) {
    console.log(`Create user: ${id}, ${hash}, ${name}, ${email}`);

    try {
        await pool.query(
            "INSERT INTO users (id, hash, name, email) VALUES ($1, $2, $3, $4);",
            [id, hash, name, email]
        );
    } catch (error) {
        console.error(`Create user failed: ${error.message}`);

        return false;
    }

    console.log("Create user succeeded.");

    return true;
}

async function readUser(id) {
    console.log(`Read user: ${id}`);

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
        console.log("Read user succeeded.");

        return result;
    } catch (error) {
        console.error(`Read user failed: ${error.message}`);

        throw Error("Query failed.");
    }
}

async function updateUser(id, updates) {
    console.log(`Update user: ${id}`);

    if (!isValidUpdate(updates)) {
        console.error("Update user failed: Invalid updates.");

        return false;
    }

    const fieldNames = Object.keys(updates);
    const updateQuery = buildUpdateQuery(fieldNames);

    const fieldValues = Object.values(updates);
    const updateParams = buildUpdateParams(id, fieldValues);

    try {
        const result = await pool.query(updateQuery, updateParams);

        if (result.rowCount > 0) {
            console.log("Update user succeeded.");

            return true;
        } else {
            console.error("Update user failed: User does not exist.");

            return false;
        }
    } catch (error) {
        console.error(`Update user failed: ${error.message}`);

        return false;
    }
}

async function deleteUser(id) {
    console.log(`Delete user: ${id}`);

    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1;", [id]);

        if (result.rowCount > 0) {
            console.log("Delete user succeeded.");

            return true;
        } else {
            console.error("Delete user failed: User does not exist.");

            return false;
        }
    } catch (error) {
        console.error(`Delete user failed: ${error.message}`);

        return false;
    }
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

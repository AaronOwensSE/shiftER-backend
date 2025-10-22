"use strict";

// Internal Modules
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";
import updateQuery from "./update-query.js";

// Exports
async function createGroup(name) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "INSERT INTO groups (name) VALUES ($1) RETURNING id;",
            [name]
        );

        result.ok = true;
        result.value = queryResult.rows[0].id;  // Need to return assigned ID.
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readGroup(id) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query("SELECT * FROM groups WHERE id = $1;", [id]);

        if (queryResult.rowCount > 0) {
            result.ok = true;
            result.value = queryResult;
        } else {
            result.ok = false;
            result.message = "Group does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function updateGroup(id, updates) {
    const result = updateQuery("groups", {id}, updates);

    return result;
}

async function deleteGroup(id) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query("DELETE FROM groups WHERE id = $1;", [id]);

        if (queryResult.rowCount > 0) {
            result.ok = true;
        } else {
            result.ok = false;
            result.message = "Group does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

// Production
const groupModel = { createGroup, readGroup, updateGroup, deleteGroup };
export default groupModel;

// Testing
export const testing =
    process.env.NODE_ENV == "test" ?
    { createGroup, readGroup, updateGroup, deleteGroup }
    : {};

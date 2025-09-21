"use strict";

// Internal Modules
import Result from "../../error-handling.js";
import pool from "../pool.js";

// Exports
async function createGroup(id, name) {
    let result = new Result();

    try {
        await pool.query("INSERT INTO groups (id, name) VALUES ($1, $2);", [id, name]);
        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readGroup(id) {
    let result = new Result();

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
    // Validate updates.
    // Rewrite query builder from user-model.js as a separate function for all models.
}

async function deleteGroup(id) {
    let result = new Result();

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

const groupModel = { createGroup, readGroup, updateGroup, deleteGroup };
export default groupModel;

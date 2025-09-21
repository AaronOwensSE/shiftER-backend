"use strict";

// Internal Modules
import Result from "../../error-handling.js";
import pool from "../pool.js";

// Exports
async function createMembership(userId, groupId, admin) {
    let result = new Result();

    try {
        await pool.query(
            "INSERT INTO memberships (user_id, group_id, admin) VALUES ($1, $2, $3);",
            [userId, groupId, admin]
        );

        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readMembership(userId, groupId) {
    let result = new Result();

    try {
        const queryResult = await pool.query(
            "SELECT * FROM memberships WHERE user_id = $1 AND group_id = $2",
            [userId, groupId]
        );

        if (queryResult.rowCount > 0) {
            result.ok = true;
            result.value = queryResult;
        } else {
            result.ok = false;
            result.message = "Membership does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readMembershipsByUserId(userId) {
    let result = new Result();

    try {
        const queryResult = await pool.query(
            "SELECT * FROM memberships WHERE user_id = $1;",
            [userId]
        );

        result.ok = true;   // 0 results OK for queries that may return many results.
        result.value = queryResult;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readMembershipsByGroupId(groupId) {
    let result = new Result();

    try {
        const queryResult = await pool.query(
            "SELECT * FROM memberships WHERE group_id = $1;",
            [groupId]
        );

        result.ok = true;   // 0 results OK for queries that may return many results.
        result.value = queryResult;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function updateMembership(userId, groupId, updates) {
    // Awaiting generic update query builder function.
}

async function deleteMembership(userId, groupId) {
    let result = new Result();

    try {
        const queryResult = await pool.query(
            "DELETE FROM memberships WHERE user_id = $1 AND group_id = $2;",
            [userId, groupId]
        );

        if (queryResult.rowCount > 0) {
            result.ok = true;
        } else {
            result.ok = false;
            result.message = "Membership does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

const membershipModel = {
    createMembership,
    readMembership,
    readMembershipsByUserId,
    readMembershipsByGroupId,
    updateMembership,
    deleteMembership
};

export default membershipModel;

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";
import updateQuery from "./update-query.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createMembership(userId, groupId, admin) {
    let result = new errorHandling.Result();

    try {
        await pool.query(
            "INSERT INTO memberships (user_id, group_id, admin) VALUES ($1, $2, $3);",
            [ userId, groupId, admin ]
        );

        result.ok = true;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readMembership(userId, groupId) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "SELECT * FROM memberships WHERE user_id = $1 AND group_id = $2;",
            [ userId, groupId ]
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
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "SELECT * FROM memberships WHERE user_id = $1;",
            [userId]
        );

        result.ok = true;
        result.value = queryResult;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function readMembershipsByGroupId(groupId) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "SELECT * FROM memberships WHERE group_id = $1;",
            [groupId]
        );

        result.ok = true;
        result.value = queryResult;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function updateMembership(userId, groupId, updates) {
    const result = await updateQuery(
        "memberships",
        { user_id: userId, group_id: groupId },
        updates
    );

    return result;
}

async function deleteMembership(userId, groupId) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "DELETE FROM memberships WHERE user_id = $1 AND group_id = $2;",
            [ userId, groupId ]
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

async function deleteMembershipsByUserId(userId) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "DELETE FROM memberships WHERE user_id = $1;",
            [userId]
        );

        result.ok = true;
        result.value = queryResult;
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

async function deleteMembershipsByGroupId(groupId) {
    let result = new errorHandling.Result();

    try {
        const queryResult = await pool.query(
            "DELETE FROM memberships WHERE group_id = $1;",
            [groupId]
        );
        
        result.ok = true;
        result.value = queryResult;
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
    deleteMembership,
    deleteMembershipsByUserId,
    deleteMembershipsByGroupId
};

export default membershipModel;

export const testing =
    process.env.NODE_ENV == "test" ?
    {
        createMembership,
        readMembership,
        readMembershipsByUserId,
        readMembershipsByGroupId,
        updateMembership,
        deleteMembership,
        deleteMembershipsByUserId,
        deleteMembershipsByGroupId
    }
    : {};

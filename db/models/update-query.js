"use strict";

// Internal Modules
import errorHandling from "../../error-handling.js";
import pool from "../pool.js";

// Exports
async function updateQuery(tableName, primaryKey, fields) {
    let result = new errorHandling.Result();

    if (!isValidUpdate(tableName, primaryKey, fields)) {
        result.ok = false;
        result.message = "Invalid update.";

        return result;
    }

    const updateQuery = buildUpdateQuery(tableName, primaryKey, fields);
    const updateParams = buildUpdateParams(primaryKey, fields);

    try {
        const queryResult = await pool.query(updateQuery, updateParams);

        if (queryResult.rowCount > 0) {
            result.ok = true;
        } else {
            result.ok = false;
            result.message = "Entry does not exist.";
        }
    } catch (error) {
        result.ok = false;
        result.message = error.message;
    }

    return result;
}

// Production
export default updateQuery;

// Testing
// We can't conditionally export, but we can conditionally build the object being exported.
export const testing =
    process.env.NODE_ENV === "test" ?
    {
        updateQuery,
        isValidUpdate,
        isValidPrimaryKey,
        isValidFieldSet,
        buildUpdateQuery,
        buildSetClause,
        buildFieldList,
        buildWhereClause,
        buildConditionList,
        buildUpdateParams
    }
    : {};

// Helper Functions
function isValidUpdate(tableName, primaryKey, fields) {
    return isValidPrimaryKey(tableName, primaryKey) && isValidFieldSet(tableName, fields);
}

function isValidPrimaryKey(tableName, primaryKey) {
    switch (tableName) {
        case "users":
        case "sessions":
        case "groups":
        case "drafts":
        case "schedules":
        case "shifts":
            return Boolean(primaryKey.id);
        case "memberships":
            return Boolean(primaryKey.user_id && primaryKey.group_id);
        case "participation":
            return Boolean(primaryKey.user_id && primaryKey.draft_id);
        default:
            return false;
    }
}

function isValidFieldSet(tableName, fields) {
    switch (tableName) {
        case "users":
            return Boolean(fields.hash || fields.name || fields.email);
        case "sessions":
            return Boolean(fields.expires || fields.user_id);
        case "groups":
            return Boolean(fields.name);
        case "drafts":
            return Boolean(
                fields.start_time
                || fields.end_time
                || fields.active_start_time
                || fields.active_end_time
                || fields.turn_duration
                || fields.paused
                || fields.group_id
            );
        case "schedules":
            return Boolean(fields.start_date || fields.end_date || fields.group_id || fields.draft_id);
        case "shifts":
            return Boolean(
                fields.start_date
                || fields.end_date
                || fields.schedule_id
                || fields.user_id
                || fields.draft_id
            );
        case "memberships":
            return Boolean(fields.admin);
        case "participation":
            return Boolean(fields.turn_order || fields.passing);
        default:
            return false;
    }
}

/*
It's well known that concatenation of many strings of at most n characters each costs O(n^2) time
complexity, while a string builder approach costs O(n).

This series of functions respects the efficiency of the string builder approach by avoiding
concatenation of those strings which vary in number according to input.

However, it endures a constant factor on n in the form of some copying in order to keep functions
concise and logically layered. I believe this tradeoff is worthwhile for increased readability and
maintainability as long as the worst-case time complexity remains O(n).
*/
function buildUpdateQuery(tableName, primaryKey, fields) {
    /*
    UPDATE table_name
    SET field_1 = $1, field_2 = $2, . . . , field_n = $n
    WHERE field_n_+_1 = $n + 1, field_n_+_2 = $n + 2, . . . , field_n_+_m = $n + m;
    */

    let updateQueryParts = [];

    const updateClause = `UPDATE ${tableName}`;
    const setClause = buildSetClause(fields);
    const nextParamNum = Object.keys(fields).length + 1;
    const whereClause = buildWhereClause(primaryKey, nextParamNum);

    updateQueryParts.push(updateClause, setClause, whereClause);
    const updateQuery = updateQueryParts.join(" ");

    return updateQuery;
}

function buildSetClause(fields) {
    // SET field_1 = $1, field_2 = $2, . . . , field_n = $n

    let setClauseParts = [];

    const setWord = "SET";
    const fieldNames = Object.keys(fields);
    const fieldList = buildFieldList(fieldNames, 1);

    setClauseParts.push(setWord, fieldList);
    const setClause = setClauseParts.join(" ");

    return setClause;
}

function buildFieldList(fieldNames, nextParamNum) {
    // field_1 = $1, field_2 = $2, . . . , field_n = $n

    let fieldListParts = [];

    for (let i = 0; i < fieldNames.length; i++, nextParamNum++) {
        fieldListParts.push(`${fieldNames[i]} = $${nextParamNum}`);
    }

    const fieldList = fieldListParts.join(", ");

    return fieldList;
}

function buildWhereClause(primaryKey, nextParamNum) {
    // WHERE field_n_+_1 = $n + 1, field_n_+_2 = $n + 2, . . . , field_n_+_m = $n + m;

    let whereClauseParts = [];

    // The deliberate space after WHERE deals with the semicolon early in the string builder
    // process. Dealing with it late by joining it to the final query string would be more organized
    // in terms of syntax analysis but would effectively double the amount of copying. We're going
    // to be practical and deal with it here.
    const whereWord = "WHERE ";
    const primaryKeyNames = Object.keys(primaryKey);
    const primaryKeyList = buildConditionList(primaryKeyNames, nextParamNum);
    const semicolon = ";";

    whereClauseParts.push(whereWord, primaryKeyList, semicolon);
    const whereClause = whereClauseParts.join("");  // No space delimiter.
    
    return whereClause;
}

function buildConditionList(primaryKeyNames, nextParamNum) {
    // field_1 = $1 AND field_2 = $2 AND . . . AND field_n = $n

    let conditionListParts = [];

    for (let i = 0; i < primaryKeyNames.length; i++, nextParamNum++) {
        conditionListParts.push(`${primaryKeyNames[i]} = $${nextParamNum}`);
    }

    const constraintList = conditionListParts.join(" AND ");

    return constraintList;
}

function buildUpdateParams(primaryKey, fields) {
    const fieldValues = Object.values(fields);
    const primaryKeyValues = Object.values(primaryKey);

    let updateParams = [];
    updateParams.push(...fieldValues, ...primaryKeyValues);

    return updateParams;
}

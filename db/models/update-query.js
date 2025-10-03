// Internal Modules
import pool from "../pool.js";

// Exports
async function updateQuery(tableName, primaryKey, fields) {
    let result = new Result();

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

export default updateQuery;

// Helper Functions
function isValidUpdate(tableName, primaryKey, fields) {
    return isValidPrimaryKey(tableName, primaryKey) && isValidUpdateSet(tableName, fields);
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

function isValidUpdateSet(tableName, fields) {
    switch (tableName) {
        case "users":
            return Boolean(fields.hash || fields.name || fields.email);
        case "sessions":
            return Boolean(fields.expires || fields.user_id);
        case "groups":
            return Boolean(fields.name);
        case "drafts":
            return Boolean(
                fields.start
                || fields.end
                || fields.active_start
                || fields.active_end
                || fields.turn_duration
                || fields.paused
                || fields.group_id
            );
        case "schedules":
            return Boolean(fields.date || fields.group_id || fields.draft_id);
        case "shifts":
            return Boolean(
                fields.start
                || fields.end
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

    for (let i = nextParamNum; i <= fieldNames.length; i++) {
        fieldListParts.push(`${fieldNames[i]} = $${i}`);
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
    const primaryKeyList = buildPrimaryKeyList(primaryKeyNames, nextParamNum);
    const semicolon = ";";

    whereClauseParts.push(whereWord, primaryKeyList, semicolon);
    const whereClause = whereClauseParts.join("");  // No space delimiter.
    
    return whereClause;
}

function buildUpdateParams(primaryKey, fields) {
    const fieldValues = Object.values(fields);
    const primaryKeyValues = Object.values(primaryKey);

    let updateParams = [];
    updateParams.push(...fieldValues, ...primaryKeyValues);

    return updateParams;
}

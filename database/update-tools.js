// =================================================================================================
// Internal Dependencies
// =================================================================================================
import pool from "./pool.js";

// =================================================================================================
// Public API
// =================================================================================================
async function updateQuery(tableName, primaryKey, fields) {
    const updateQuery = buildUpdateQuery(tableName, primaryKey, fields);
    const updateParams = buildUpdateParams(primaryKey, fields);
    const queryResult = await pool.query(updateQuery, updateParams);

    return queryResult;
}

const updateTools = { updateQuery };
export default updateTools;

// =================================================================================================
// Helper Functions
// =================================================================================================
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

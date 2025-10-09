"use strict";

import { testing } from "./update-query.js";

test("buildFieldList: Valid field list from paramNum = 1.", () => {
    const fieldNames = [ "id", "name", "email" ];
    const nextParamNum = 1;
    const fieldList = testing.buildFieldList(fieldNames, nextParamNum);

    expect(fieldList).toBe("id = $1, name = $2, email = $3");
});

test("buildFieldList: Valid field list from paramNum = n = 5.", () => {
    const fieldNames = [ "id", "name", "email" ];
    const nextParamNum = 5;
    const fieldList = testing.buildFieldList(fieldNames, nextParamNum);

    expect(fieldList).toBe("id = $5, name = $6, email = $7");
});

test("buildSetClause: Valid SET clause from valid field list.", () => {
    const fields = { id: "bob", name: "Bob Johnson", email: "bob@bobjohnson.com" };
    const setClause = testing.buildSetClause(fields);

    expect(setClause).toBe("SET id = $1, name = $2, email = $3");
});

test("buildConditionList: Valid condition list from paramNum = n = 5.", () => {
    const primaryKeyNames = [ "user_id", "group_id" ];
    const nextParamNum = 5;
    const conditionList = testing.buildConditionList(primaryKeyNames, nextParamNum);

    expect(conditionList).toBe("user_id = $5 AND group_id = $6");
});

test("buildWhereClause: Valid WHERE clause from valid primary key and paramNum = n = 5.", () => {
    const primaryKey = { user_id: "bob", group_id: "spungos" };
    const whereClause = testing.buildWhereClause(primaryKey, 5);

    expect(whereClause).toBe("WHERE user_id = $5 AND group_id = $6;");
});

test("buildUpdateParams: Valid update parameter array from valid primary key and fields.", () => {
    const primaryKey = { user_id: "bob", draft_id: 1234 };
    const fields = { turn_order: 2, passing: false };
    const updateParams = testing.buildUpdateParams(primaryKey, fields);

    expect(updateParams).toStrictEqual([ 2, false, "bob", 1234 ]);
});

test("buildUpdateQuery: Valid UPDATE query from valid table name, primary key, and fields.", () => {
    const tableName = "memberships";
    const primaryKey = { user_id: "bob", group_id: "spungos" };
    const fields = { admin: true };
    const updateQuery = testing.buildUpdateQuery(tableName, primaryKey, fields);

    expect(updateQuery).toBe("UPDATE memberships SET admin = $1 WHERE user_id = $2 AND group_id = $3;");
});

/*
Remaining: isValidUpdate, isValidPrimaryKey, isValidFieldSet, updateQuery
*/

/*
test("Update an existing user.", async () => {
    const tableName = "users";
    const primaryKey = { id: "bob" };
    const fields = { name: "Bob Johnson" };
    const result = await testing.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(true);
});

test("Update a non-existent user.", async () => {
    const tableName = "users";
    const primaryKey = { id: "nobody" };
    const fields = { email: "nobody@nobody.com" };
    const result = await testing.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(false);
});
*/

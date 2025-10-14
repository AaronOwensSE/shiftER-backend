"use strict";

// Internal Modules
import "../../env-config.js";    // Should always be first.
import { testing } from "./update-query.js";
import cleanup from "../../cleanup.js";

// Run
// Test Set
test("buildFieldList: Statement Coverage 1.", () => {
    const fieldNames = [ "id", "name", "email" ];
    const nextParamNum = 1;
    const fieldList = testing.buildFieldList(fieldNames, nextParamNum);

    expect(fieldList).toBe("id = $1, name = $2, email = $3");
});

test("buildSetClause: Statement Coverage 1", () => {
    const fields = { id: "bob", name: "Bob Johnson", email: "bob@bobjohnson.com" };
    const setClause = testing.buildSetClause(fields);

    expect(setClause).toBe("SET id = $1, name = $2, email = $3");
});

test("buildConditionList: Statement Coverage 1", () => {
    const primaryKeyNames = [ "user_id", "group_id" ];
    const nextParamNum = 5;
    const conditionList = testing.buildConditionList(primaryKeyNames, nextParamNum);

    expect(conditionList).toBe("user_id = $5 AND group_id = $6");
});

test("buildWhereClause: Statement Coverage 1", () => {
    const primaryKey = { user_id: "bob", group_id: "spungos" };
    const nextParamNum = 5;
    const whereClause = testing.buildWhereClause(primaryKey, nextParamNum);

    expect(whereClause).toBe("WHERE user_id = $5 AND group_id = $6;");
});

test("buildUpdateParams: Statement Coverage 1", () => {
    const primaryKey = { user_id: "bob", draft_id: 1234 };
    const fields = { turn_order: 2, passing: false };
    const updateParams = testing.buildUpdateParams(primaryKey, fields);

    expect(updateParams).toStrictEqual([ 2, false, "bob", 1234 ]);
});

test("buildUpdateQuery: Statement Coverage 1", () => {
    const tableName = "memberships";
    const primaryKey = { user_id: "bob", group_id: "spungos" };
    const fields = { admin: true };
    const updateQuery = testing.buildUpdateQuery(tableName, primaryKey, fields);

    expect(updateQuery).toBe(
        "UPDATE memberships SET admin = $1 WHERE user_id = $2 AND group_id = $3;"
    );
});

test("isValidPrimaryKey: Statement Coverage 1", () => {
    const tableName = "users";
    const primaryKey = { id: "something" };
    const valid = testing.isValidPrimaryKey(tableName, primaryKey);

    expect(valid).toBe(true);
});

test("isValidPrimaryKey: Statement Coverage 2", () => {
    const tableName = "memberships";
    const primaryKey = { user_id: "something", group_id: "group1" };
    const valid = testing.isValidPrimaryKey(tableName, primaryKey);

    expect(valid).toBe(true);
});

test("isValidPrimaryKey: Statement Coverage 3", () => {
    const tableName = "participation";
    const primaryKey = { user_id: "something", draft_id: "group1" };
    const valid = testing.isValidPrimaryKey(tableName, primaryKey);

    expect(valid).toBe(true);
});

test("isValidPrimaryKey: Statement Coverage 4", () => {
    const tableName = "not_a_table";
    const primaryKey = { user_id: "something", group_id: "group1" };
    const valid = testing.isValidPrimaryKey(tableName, primaryKey);

    expect(valid).toBe(false);
});

test("isValidFieldSet: Statement Coverage 1", () => {
    const tableName = "users";
    const fields = { name: "bob" };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 2", () => {
    const tableName = "sessions";
    const fields = { user_id: "bob" };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 3", () => {
    const tableName = "groups";
    const fields = { name: "coolgroup" };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 4", () => {
    const tableName = "drafts";
    const fields = { turn_duration: 5 };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 5", () => {
    const tableName = "schedules";
    const fields = { group_id: "coolgroup" };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 6", () => {
    const tableName = "shifts";
    const fields = { user_id: "bob" };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 7", () => {
    const tableName = "memberships";
    const fields = { admin: true };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 8", () => {
    const tableName = "participation";
    const fields = { passing: true };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(true);
});

test("isValidFieldSet: Statement Coverage 1", () => {
    const tableName = "not_a_table";
    const fields = { name: "bob" };
    const valid = testing.isValidFieldSet(tableName, fields);

    expect(valid).toBe(false);
});

test("isValidUpdate: Statement Coverage 1", () => {
    const tableName = "users";
    const primaryKey = { id: "bob" };
    const fields = { name: "Bob Jones" };
    const valid = testing.isValidUpdate(tableName, primaryKey, fields);

    expect(valid).toBe(true);
});

test("updateQuery: Statement Coverage 1", async () => {
    const tableName = "users";
    const primaryKey = { id: "janey" };
    const fields = { name: "Jane Jackson" };
    const result = await testing.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(true);
});

test("updateQuery: Statement Coverage 2", async () => {
    const tableName = "users";
    const primaryKey = { id: "nobody" };
    const fields = { email: "nobody@nobody.com" };
    const result = await testing.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(false);
});

test("updateQuery: Statement Coverage 3", async () => {
    const tableName = "users";
    const primaryKey = { id: "bob" };
    const fields = { email: "nobody@nobody.com", fake_field: "something" };
    const result = await testing.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(false);
});

test("updateQuery: Statement Coverage 4", async () => {
    const tableName = "fake_table";
    const primaryKey = { id: "nobody" };
    const fields = { email: "nobody@nobody.com" };
    const result = await testing.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(false);
});

// Cleanup
await cleanup();

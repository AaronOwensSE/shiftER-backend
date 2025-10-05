"use strict";

import test from "./update-query.js";

test("Update an existing user.", async () => {
    const tableName = "users";
    const primaryKey = { id: "bob" };
    const fields = { name: "Bob Johnson" };
    const result = await test.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(true);
});

test("Update a non-existent user.", async () => {
    const tableName = "users";
    const primaryKey = { id: "nobody" };
    const fields = { email: "nobody@nobody.com" };
    const result = await test.updateQuery(tableName, primaryKey, fields);

    expect(result.ok).toBe(false);
});

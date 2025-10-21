"use strict";

// Internal Modules
import "../../../setup.js";    // Should always be first.
import pool from "../../pool.js";

// Run
await deleteSchema();
await pool.end();

// Main Function
async function deleteSchema() {
    console.log("Attempting to delete database schema:");
    await dropTable("sessions");
    await dropTable("memberships");
    await dropTable("users");
    await dropTable("groups");
    console.log();
}

// Helper Functions
async function dropTable(tableName, cascade = false) {
    try {
        if (cascade) {
            await pool.query(`DROP TABLE ${tableName};`);
        } else {
            await pool.query(`DROP TABLE ${tableName} CASCADE;`);
        }
    } catch (err) {
        console.error(`Dropping table ${tableName} failed: ${err.messsage}`);

        return false;
    }

    console.log(`Table ${tableName} dropped.`);

    return true;
}

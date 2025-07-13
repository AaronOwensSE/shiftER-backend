"use strict";

// Connection Pool
import pool from "../../pool.js";

// Exports
export default async function deleteSchema() {
    console.log("Attempting to delete database schema:");
    await dropTable("sessions");
    await dropTable("users");
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
        console.log(`Dropping table ${tableName} failed: ${err.messsage}`);

        return false;
    }

    console.log(`Table ${tableName} dropped.`);

    return true;
}

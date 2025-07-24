"use strict";

// Internal Modules
import pool from "../../pool.js";

// Exports
export default async function deleteData() {
    console.log("Attempting to delete data:");
    await deleteTableData("sessions");
    await deleteTableData("users");
    console.log();
}

// Helper Functions
async function deleteTableData(tableName) {
    try {
        await pool.query(`DELETE FROM ${tableName};`);
    } catch (err) {
        console.error(`Data deletion from table ${tableName} failed: ${err.message}`);

        return false;
    }

    console.log(`Data deleted from table ${tableName}.`);

    return true;
}

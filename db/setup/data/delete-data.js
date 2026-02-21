// =================================================================================================
// Internal Dependencies
// =================================================================================================
import "../../../setup.js";    // Must be first.
import pool from "../../pool.js";

// =================================================================================================
// Commands
// =================================================================================================
await deleteData();
await pool.end();

// =================================================================================================
// Main Function
// =================================================================================================
async function deleteData() {
    console.log("Attempting to delete data:");
    await deleteTableData("sessions");
    await deleteTableData("memberships");
    await deleteTableData("participation");
    await deleteTableData("shifts");
    await deleteTableData("users");
    await deleteTableData("schedules");
    await deleteTableData("drafts");
    await deleteTableData("groups");
}

// =================================================================================================
// Helper Functions
// =================================================================================================
async function deleteTableData(tableName) {
    try {
        await pool.query(`DELETE FROM ${tableName};`);
    } catch (err) {
        console.log(`Data deletion from table ${tableName} failed: ${err.message}`);
    }

    console.log(`Data deleted from table ${tableName}.`);
}

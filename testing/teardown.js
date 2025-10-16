"use strict";

// Internal Modules
import pool from "../db/pool.js";

// Export
export default async function teardown() {
    await pool.end();
}

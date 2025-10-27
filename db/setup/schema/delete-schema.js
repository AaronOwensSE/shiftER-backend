"use strict";

// Internal Modules
import "../../../setup.js";
import pool from "../../pool.js";
import schema from "./schema.js";

// Run
await schema.deleteSchema();
await pool.end();

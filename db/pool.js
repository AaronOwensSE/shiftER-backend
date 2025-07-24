"use strict";

// External Dependencies
import pg from "pg";

// Exports
const pool = new pg.Pool({
    user:       process.env.DB_USERNAME,
    password:   process.env.DB_PASSWORD,
    host:       process.env.DB_HOST,
    port:       process.env.DB_PORT,
    database:   process.env.DB_NAME,
});

export default pool;

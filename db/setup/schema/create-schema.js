"use strict";

// Internal Modules
import "../../../env-config.js";    // Should always be first.

import {
    USER_ID_MAX_LENGTH,
    USER_NAME_MAX_LENGTH,
    USER_EMAIL_MAX_LENGTH,
} from "../../../../constants.js";

import pool from "../../pool.js";
import cleanup from "../../../cleanup.js";

// Run
await createSchema();
await cleanup();

// Main Function
async function createSchema() {
    console.log("Attempting to create database schema:");
    await createUsersTable();
    await createSessionsTable();
    console.log();
}

// Helper Functions
async function createUsersTable() {
    try {
        await pool.query(`
            CREATE TABLE users (
                id VARCHAR(${USER_ID_MAX_LENGTH.toString()}) PRIMARY KEY,
                hash TEXT,
                name VARCHAR(${USER_NAME_MAX_LENGTH.toString()}),
                email VARCHAR(${USER_EMAIL_MAX_LENGTH.toString()})
            );
        `);
    } catch (err) {
        console.error(`Failed to create table users: ${err.message}`);

        return false;
    }

    console.log("Table users created.");

    return true;
}

async function createSessionsTable() {
    try {
        await pool.query(`
            CREATE TABLE sessions (
                id TEXT PRIMARY KEY,
                expires DATE,
                user_id VARCHAR(${USER_ID_MAX_LENGTH.toString()})
                    REFERENCES users (id) ON DELETE CASCADE
            );
        `);
    } catch (err) {
        console.error(`Failed to create table sessions: ${err.message}`);

        return false;
    }

    console.log("Table sessions created.");

    return true;
}

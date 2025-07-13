"use strict";

// Connection Pool
import pool from "../../pool.js";

// Constants
// Can change to export a single object if desired.
import {
    USER_ID_MAX_LENGTH,
    USER_NAME_MAX_LENGTH,
    USER_EMAIL_MAX_LENGTH,
} from "../../../../constants.js";

// Exports
export default async function createSchema() {
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
                salt TEXT,
                hash TEXT,
                name VARCHAR(${USER_NAME_MAX_LENGTH.toString()}),
                email VARCHAR(${USER_EMAIL_MAX_LENGTH.toString()})
            );
        `);
    } catch (err) {
        console.log(`Failed to create table users: ${err.message}`);

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
                user_id VARCHAR(${USER_ID_MAX_LENGTH.toString()}) REFERENCES users (id) ON DELETE CASCADE
            );
        `);
    } catch (err) {
        console.log(`Failed to create table sessions: ${err.message}`);

        return false;
    }

    console.log("Table sessions created.");

    return true;
}

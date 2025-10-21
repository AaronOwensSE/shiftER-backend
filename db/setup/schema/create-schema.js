"use strict";

// Internal Modules
import "../../../setup.js";    // Should always be first.

import {
    USER_ID_MAX_LENGTH,
    USER_NAME_MAX_LENGTH,
    USER_EMAIL_MAX_LENGTH,
    GROUP_NAME_MAX_LENGTH
} from "../../../constants.js";

import pool from "../../pool.js";

// Run
await createSchema();
await pool.end();

// Main Function
async function createSchema() {
    console.log("Attempting to create database schema:");
    await createUsersTable();
    await createSessionsTable();
    await createGroupsTable();
    await createMembershipsTable();
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
    } catch (error) {
        console.error(`Failed to create table users: ${error.message}`);

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
                expires TIMESTAMPTZ,
                user_id VARCHAR(${USER_ID_MAX_LENGTH.toString()})
                    REFERENCES users (id) ON DELETE CASCADE
            );
        `);
    } catch (error) {
        console.error(`Failed to create table sessions: ${error.message}`);

        return false;
    }

    console.log("Table sessions created.");

    return true;
}

async function createGroupsTable() {
    try {
        await pool.query(`
            CREATE TABLE groups (
                id SERIAL PRIMARY KEY,
                name VARCHAR(${GROUP_NAME_MAX_LENGTH.toString()})
            );
        `);
    } catch (error) {
        console.error(`Failed to create table groups: ${error.message}`);

        return false;
    }

    console.log("Table groups created.");

    return true;
}

async function createMembershipsTable() {
    try {
        await pool.query(`
            CREATE TABLE memberships (
                user_id VARCHAR(${USER_ID_MAX_LENGTH.toString()})
                    REFERENCES users (id) ON DELETE CASCADE,
                group_id INT
                    REFERENCES groups (id) ON DELETE CASCADE,
                admin BOOLEAN,
                PRIMARY KEY (user_id, group_id)
            );
        `);
    } catch (error) {
        console.error(`Failed to create table memberships: ${error.message}`);

        return false;
    }

    console.log("Table memberships created.");

    return true;
}

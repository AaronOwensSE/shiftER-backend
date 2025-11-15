"use strict";

// Internal Modules
import constants from "../../../../shared/constants.js";
import pool from "../../pool.js";

// Exports
async function createSchema() {
    console.log("Attempting to create database schema:");
    await createUsersTable();
    await createSessionsTable();
    await createGroupsTable();
    await createMembershipsTable();
    await createDraftsTable();
    await createParticipationTable();
    await createSchedulesTable();
    await createShiftsTable();
    console.log();
}

async function deleteSchema() {
    console.log("Attempting to delete database schema:");
    await dropTable("sessions");
    await dropTable("memberships");
    await dropTable("users");
    await dropTable("groups");
    await dropTable("participation");
    await dropTable("drafts");
    await dropTable("shifts");
    await dropTable("schedules");
    console.log();
}

// Production
const schema = { createSchema, deleteSchema };
export default schema;

// Testing
export const testing =
    process.env.NODE_ENV == "test" ?
    {
        createSchema,
        deleteSchema,
        createUsersTable,
        createSessionsTable,
        createGroupsTable,
        createMembershipsTable,
        createDraftsTable,
        createParticipationTable,
        createSchedulesTable,
        createShiftsTable,
        dropTable
    }
    : {};

// Helper Functions
async function createUsersTable() {
    try {
        await pool.query(`
            CREATE TABLE users (
                id VARCHAR(${constants.USER_ID_MAX_LENGTH.toString()}) PRIMARY KEY,
                hash TEXT,
                name VARCHAR(${constants.USER_NAME_MAX_LENGTH.toString()}),
                email VARCHAR(${constants.USER_EMAIL_MAX_LENGTH.toString()})
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
                user_id VARCHAR(${constants.USER_ID_MAX_LENGTH.toString()})
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
                name VARCHAR(${constants.GROUP_NAME_MAX_LENGTH.toString()})
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
                user_id VARCHAR(${constants.USER_ID_MAX_LENGTH.toString()})
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

async function createDraftsTable() {
    try {
        await pool.query(`
            CREATE TABLE drafts (
                id SERIAL PRIMARY KEY,
                start_time TIMESTAMPTZ,
                end_time TIMESTAMPTZ,
                active_start_time TIME,
                active_end_time TIME,
                turn_duration INTERVAL HOUR TO MINUTE,
                paused BOOLEAN,
                group_id INT
                    REFERENCES groups (id) ON DELETE CASCADE
            );
        `);
    } catch (error) {
        console.error(`Failed to create table drafts: ${error.message}`);

        return false;
    }

    console.log("Table drafts created.");

    return true;
}

async function createParticipationTable() {
    try {
        await pool.query(`
            CREATE TABLE participation (
                user_id VARCHAR(${constants.USER_ID_MAX_LENGTH})
                    REFERENCES users (id) ON DELETE CASCADE,
                draft_id INT
                    REFERENCES drafts (id) ON DELETE CASCADE,
                turn_order INT,
                passing BOOLEAN,
                PRIMARY KEY (user_id, draft_id)
            );
        `);
    } catch (error) {
        console.error(`Failed to create table participation: ${error.message}`);

        return false;
    }

    console.log("Table participation created.");

    return true;
}

async function createSchedulesTable() {
    try {
        await pool.query(`
            CREATE TABLE schedules (
                id SERIAL PRIMARY KEY,
                start_date DATE,
                end_date DATE,
                group_id INT
                    REFERENCES groups (id) ON DELETE CASCADE,
                draft_id INT
                    REFERENCES drafts (id) ON DELETE CASCADE
            );
        `);
    } catch (error) {
        console.error(`Failed to create table schedules: ${error.message}`);

        return false;
    }

    console.log("Table schedules created.");

    return true;
}

async function createShiftsTable() {
    try {
        await pool.query(`
            CREATE TABLE shifts (
                id SERIAL PRIMARY KEY,
                start_time TIMESTAMPTZ,
                end_time TIMESTAMPTZ,
                schedule_id INT
                    REFERENCES schedules (id),
                user_id VARCHAR(${constants.USER_ID_MAX_LENGTH})
                    REFERENCES users (id)
            );
        `);
    } catch (error) {
        console.error(`Failed to create table shifts: ${error.message}`);

        return false;
    }

    console.log("Table shifts created.");

    return true;
}

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

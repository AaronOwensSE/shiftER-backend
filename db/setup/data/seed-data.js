"use strict";

// Connection Pool
import pool from "../../pool.js";

// Exports
export default async function seedData() {
    console.log("Attempting to seed database schema:");
    await seedUsers();
    await seedSessions();
    console.log();
}

// Helper Functions
async function seedUsers() {
    try {
        await pool.query(`
            INSERT INTO users (id, salt, hash, name, email) VALUES
            ('bob1', '1234salt', '1234hash', 'Bob Jones', 'bob@example.com'),
            ('sally2', '1234salt', '1234hash', 'Sally Sitwell', 'sally@example.com'),
            ('jimmy3', '1234salt', '1234hash', 'Jimmy Slim', 'jimmy@example.com'),
            ('max4', '1234salt', '1234hash', 'Max Robespierre', 'max@example.com'),
            ('jane5', '1234salt', '1234hash', 'Jane Cobb', 'jane@example.com');
        `);
    } catch (err) {
        console.log(`Test data insertion to table users failed: ${err.message}`);

        return false;
    }

    console.log("Test data inserted to table users.");

    return true;
}

async function seedSessions() {
    try {
        await pool.query(`
            INSERT INTO sessions (id, expires, user_id) VALUES
            ('123sally321', '2025-07-12', 'sally2'),
            ('123jimmy321', '2025-07-13', 'jimmy3'),
            ('123jane321', '2025-07-14', 'jane5');
        `);
    } catch (err) {
        console.log(`Test data insertion to table sessions failed: ${err.message}`);

        return false;
    }

    console.log("Test data inserted to table sessions.");
}

"use strict";

// Internal Modules
import pool from            "../../pool.js";
import { createUser } from  "../../models/user-model.js";

// Exports
export default async function seedData() {
    console.log("Attempting to seed database schema:");
    await seedUsers();
    await seedSessions();
    console.log();
}

// Helper Functions
async function seedUsers() {
    await createUser("bob", "bob's1password5", "Bob Jones", "bob@example.com");
    await createUser("janey", "asdfjfkla;lkdfjaskldp;", "Jane Johnson", "jane@example.com");
    await createUser("O'KEEFE", "1keefkeef12323", "Keith O'Keefe", "keith@example.com");
    await createUser("sally1", "zp123klob9!!!", "Sally Smithers", "sally@example.com");
    await createUser("MARVIN", "whoamiwhatami", "Marvin Fellow", "marvin@example.com");

    /*
    try {
        await pool.query(`
            INSERT INTO users (id, hash, name, email) VALUES
            ('bob1', '1234salt', '1234hash', 'Bob Jones', 'bob@example.com'),
            ('sally2', '1234salt', '1234hash', 'Sally Sitwell', 'sally@example.com'),
            ('jimmy3', '1234salt', '1234hash', 'Jimmy Slim', 'jimmy@example.com'),
            ('max4', '1234salt', '1234hash', 'Max Robespierre', 'max@example.com'),
            ('jane5', '1234salt', '1234hash', 'Jane Cobb', 'jane@example.com');
        `);
    } catch (err) {
        console.error(`Test data insertion to table users failed: ${err.message}`);

        return false;
    }

    console.log("Test data inserted to table users.");

    return true;
    */
}

async function seedSessions() {
    try {
        await pool.query(`
            INSERT INTO sessions (id, expires, user_id) VALUES
            ('123sally321', '2025-07-12', 'bob'),
            ('123jimmy321', '2025-07-13', 'janey'),
            ('123jane321', '2025-07-14', 'MARVIN');
        `);
    } catch (err) {
        console.error(`Test data insertion to table sessions failed: ${err.message}`);

        return false;
    }

    console.log("Test data inserted to table sessions.");
}

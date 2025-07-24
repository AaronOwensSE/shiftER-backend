"use strict";

// External Dependencies
import bcrypt from "bcrypt";

// Internal Modules
import { SALT_DEFAULT_ROUNDS } from "../constants.js";
import { isValidUser } from "../validation.js";
import userModel from "../db/models/user-model.js";

// Exports
async function createUser(id, password, name, email) {
    console.log(`Create user: ${id}, ${password}, ${name}, ${email}`);

    if (!isValidUser(id, password, name, email)) {
        console.error("Create user failed: Invalid user.");

        return false;
    }

    try {
        if (await userExists(id)) {
            console.error("Create user failed: User already exists.");

            return false;
        }
    } catch (error) {
        console.error(`Create user failed: ${error.message}`);

        return false;
    }

    const hash = generateHash(password);
    const userCreated = await userModel.createUser(id, hash, name, email);

    if (userCreated) {
        console.log("Create user succeeded.");
    } else {
        console.error("Create user failed.");
    }

    return userCreated;
}

const userController = { createUser };
export default userController;

// Helper Functions
async function userExists(id) {
    console.log(`User ${id} exists?`);

    try {
        const result = await userModel.readUser(id);
        const userFound = result.length > 0;

        if (userFound) {
            console.log(`User ${id} exists.`);
        } else {
            console.log(`User ${id} does not exist.`);
        }

        return userFound;
    } catch (error) {
        console.error(`User ${id} exists? failed: ${error.message}`);

        throw error;    // Propagate
    }
}

function generateHash(password) {
    const salt = bcrypt.genSalt(SALT_DEFAULT_ROUNDS);
    const hash = bcrypt.hash(password, salt);

    return hash;
}

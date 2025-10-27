"use strict";

// Internal Modules
import { SALT_DEFAULT_ROUNDS } from "./constants.js";

// External Dependencies
import bcrypt from "bcrypt";

// Exports
async function generateHash(password) {
    const salt = await bcrypt.genSalt(SALT_DEFAULT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

const crypt = { generateHash };
export default crypt;

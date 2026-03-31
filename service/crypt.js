// =================================================================================================
// External Dependencies
// =================================================================================================
import bcrypt from "bcrypt";
import crypto from "crypto";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../constants.js";

// =================================================================================================
// Public API
// =================================================================================================
async function generateHash(password) {
    const salt = await bcrypt.genSalt(constants.SALT_DEFAULT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

async function passwordMatchesHash(password, hash) {
    const passwordMatchesHash = await bcrypt.compare(password, hash);

    return passwordMatchesHash;
}

function generateRandomBytes(numBytes) {
    const randomBytes = crypto.randomBytes(numBytes);

    return randomBytes;
}

const crypt = { generateHash, passwordMatchesHash, generateRandomBytes };
export default crypt;

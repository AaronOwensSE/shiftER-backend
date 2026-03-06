// =================================================================================================
// External Dependencies
// =================================================================================================
import bcrypt from "bcrypt";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "./constants.js";

// =================================================================================================
// Public API
// =================================================================================================
async function generateHash(password) {
    const salt = await bcrypt.genSalt(constants.SALT_DEFAULT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

const crypt = { generateHash };
export default crypt;

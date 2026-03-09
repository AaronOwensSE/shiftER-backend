// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import crypt from "./crypt.js";
import validation from "./validation.js";
import database from "../database/database.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    if (!validation.isValidUser(user)) {
        throw new errors.ValidationError();
    }

    const { id, password, name, email } = user;
    const hash = await crypt.generateHash(password);
    const dbReadyUser = { id: id, hash: hash, name: name, email: email };

    return await database.createUser(dbReadyUser);
}

const userServices = { createUser };
export default userServices;

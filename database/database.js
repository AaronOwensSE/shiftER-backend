// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userModel from "./user-model.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    return await userModel.createUser(user);
}

async function readUser(id) {
    return await userModel.readUser(id);
}

async function createSession(id, userId, expires) {
    return await sessionModel.createSession(id, userId, expires);
}

const database = { createUser, readUser, createSession };
export default database;

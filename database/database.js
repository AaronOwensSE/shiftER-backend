// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userModel from "./user-model.js";
import sessionModel from "./session-model.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    return await userModel.createUser(user);
}

async function readUser(id) {
    return await userModel.readUser(id);
}

async function createSession(sessionId, userId, expires) {
    return await sessionModel.createSession(sessionId, userId, expires);
}

const database = { createUser, readUser, createSession };
export default database;

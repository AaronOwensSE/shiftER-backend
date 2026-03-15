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

async function readUserIdFromActiveSession(sessionId) {
    return await sessionModel.readUserIdFromActiveSession(sessionId);
}

async function deleteSession(sessionId) {
    await sessionModel.deleteSession(sessionId);
}

async function deleteSessionsByUserId(userId) {
    await sessionModel.deleteSessionsByUserId(userId);
}

const database = {
    createUser,
    readUser,
    createSession,
    readUserIdFromActiveSession,
    deleteSession,
    deleteSessionsByUserId
};

export default database;

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import sessionRepository from "./repositories/session-repository.js";
import userRepository from "./repositories/user-repository.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    return await userRepository.createUser(user);
}

async function readUser(id) {
    return await userRepository.readUser(id);
}

async function createSession(sessionId, userId, expires) {
    return await sessionRepository.createSession(sessionId, userId, expires);
}

async function readUserIdFromActiveSession(sessionId) {
    return await sessionRepository.readUserIdFromActiveSession(sessionId);
}

async function deleteSession(sessionId) {
    return await sessionRepository.deleteSession(sessionId);
}

async function deleteSessionsByUserId(userId) {
    return await sessionRepository.deleteSessionsByUserId(userId);
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

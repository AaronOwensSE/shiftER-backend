// =================================================================================================
// Internal Dependencies
// =================================================================================================
import sessionRepository from "./repositories/session-repository.js";
import userRepository from "./repositories/user-repository.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    await userRepository.createUser(user);
}

async function readUser(id) {
    return await userRepository.readUser(id);
}

async function deleteUser(id) {
    await userRepository.deleteUser(id);
}

async function createSession(sessionId, userId, expires) {
    await sessionRepository.createSession(sessionId, userId, expires);
}

async function readUserIdFromActiveSession(sessionId) {
    return await sessionRepository.readUserIdFromActiveSession(sessionId);
}

async function deleteSession(sessionId) {
    await sessionRepository.deleteSession(sessionId);
}

async function deleteSessionsByUserId(userId) {
    await sessionRepository.deleteSessionsByUserId(userId);
}

const database = {
    createUser,
    readUser,
    deleteUser,
    createSession,
    readUserIdFromActiveSession,
    deleteSession,
    deleteSessionsByUserId
};

export default database;

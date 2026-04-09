// =================================================================================================
// Internal Dependencies
// =================================================================================================
import sessionRepository from "./repositories/session-repository.js";
import userRepository from "./repositories/user-repository.js";

// =================================================================================================
// Public API
// =================================================================================================
/**
 * @throws {EntryAlreadyExistsError}
 */
async function createUser(user) {
    await userRepository.createUser(user);
}

/**
 * @throws {EntryDoesNotExistError}
 */
async function readUser(id) {
    return await userRepository.readUser(id);
}

/**
 * @throws {EntryDoesNotExistError}
 */
async function updateUser(id, updates) {
    return await userRepository.updateUser(id, updates);
}

/**
 * @throws {EntryDoesNotExistError}
 */
async function deleteUser(id) {
    await userRepository.deleteUser(id);
}

/**
 * @throws {EntryAlreadyExistsError}
 */
async function createSession(sessionId, userId, expires) {
    await sessionRepository.createSession(sessionId, userId, expires);
}

/**
 * @throws {EntryDoesNotExistError}
 */
async function readUserIdFromActiveSession(sessionId) {
    return await sessionRepository.readUserIdFromActiveSession(sessionId);
}

/**
 * @throws {EntryDoesNotExistError}
 */
async function deleteSession(sessionId) {
    await sessionRepository.deleteSession(sessionId);
}

/**
 * @throws {EntryDoesNotExistError}
 */
async function deleteSessionsByUserId(userId) {
    await sessionRepository.deleteSessionsByUserId(userId);
}

const database = {
    createUser,
    readUser,
    updateUser,
    deleteUser,

    createSession,
    readUserIdFromActiveSession,
    deleteSession,
    deleteSessionsByUserId
};

export default database;

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userService from "./services/user-service.js";
import sessionService from "./services/session-service.js";

// =================================================================================================
// Public API
// =================================================================================================
/**
 * @throws {InvalidInputError}
 * @throws {ResourceAlreadyExistsError}
 */
async function createUser(user) {
    await userService.createUser(user);
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {UnauthorizedAccessError}
 * @throws {ResourceDoesNotExistError}
 */
async function retrieveUserProfile(sessionId, userId) {
    return await userService.retrieveUserProfile(sessionId, userId);
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {UnauthorizedAccessError}
 * @throws {ResourceDoesNotExistError}
 */
async function updateUserProfile(sessionId, userId, updates) {
    await userService.updateUserProfile(sessionId, userId, updates);
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {UnauthorizedAccessError}
 * @throws {ResourceDoesNotExistError}
 */
async function deleteUser(sessionId, userId) {
    await userService.deleteUser(sessionId, userId);
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {TooManyAttemptsError}
 */
async function logIn(userId, password) {
    return await sessionService.logIn(userId, password);
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 */
async function resumeSession(sessionId) {
    return await sessionService.resumeSession(sessionId);
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 */
async function logOut(sessionId) {
    await sessionService.logOut(sessionId);
}

const service = {
    createUser,
    retrieveUserProfile,
    updateUserProfile,
    deleteUser,
    
    logIn,
    resumeSession,
    logOut
};

export default service;

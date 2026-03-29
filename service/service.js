// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userService from "./services/user-service.js";
import sessionService from "./services/session-service.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    return await userService.createUser(user);
}

async function logIn(userId, password) {
    return await sessionService.logIn(userId, password);
}

async function resumeSession(sessionId) {
    return await sessionService.resumeSession(sessionId);
}

async function logOut(sessionId) {
    await sessionService.logOut(sessionId);
}

const service = { createUser, logIn, resumeSession, logOut };
export default service;

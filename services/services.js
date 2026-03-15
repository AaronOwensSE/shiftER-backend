// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userService from "./user-service.js";
import authenticationService from "./authentication-service.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    return await userService.createUser(user);
}

async function logIn(userId, password) {
    return await authenticationService.logIn(userId, password);
}

async function authenticateSession(sessionId) {
    return await authenticationService.authenticateSession(sessionId);
}

async function logOut(sessionId) {
    await authenticationService.logOut(sessionId);
}

const services = { createUser, logIn, authenticateSession, logOut };
export default services;

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

const services = { createUser, logIn };
export default services;

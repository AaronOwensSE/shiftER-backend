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

async function logIn(id, password) {
    return await authenticationService.logIn(id, password);
}

const services = { createUser, logIn };
export default services;

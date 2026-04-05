// =================================================================================================
// Internal Dependencies
// =================================================================================================
import crypt from "./crypt.js";
import serviceErrors from "./service-errors.js";
import database from "../database/database.js";
import databaseErrors from "../database/database-errors.js";

// =================================================================================================
// Public API
// =================================================================================================
async function authenticateCredentials(userId, password) {
    let user;

    try {
        user = await database.readUser(userId);
    } catch (error) {
        if (error instanceof databaseErrors.EntryDoesNotExistError) {
            return false;
        } else {
            throw error;
        }
    }

    const credentialsValid = await crypt.passwordMatchesHash(password, user.hash);
    
    return credentialsValid;
}

/**
 * @throws {UnableToAuthenticateError}
 */
async function authenticateSessionId(sessionId) {
    let userId;

    try {
        userId = await database.readUserIdFromActiveSession(sessionId);
    } catch (error) {
        if (error instanceof databaseErrors.EntryDoesNotExistError) {
            throw new serviceErrors.UnableToAuthenticateError();
        } else {
            throw error;
        }
    }

    return userId;
}

const authentication = { authenticateCredentials, authenticateSessionId };
export default authentication;

// =================================================================================================
// External Dependencies
// =================================================================================================
import bcrypt from "bcrypt";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import database from "../database/database.js";

// =================================================================================================
// Public API
// =================================================================================================
async function authenticateCredentials(userId, password) {
    let user;

    try {
        user = await database.readUser(userId);
    } catch (error) {
        if (error instanceof errors.ResourceDoesNotExistError) {
            return false;
        } else {
            throw error;
        }
    }

    const credentialsValid = await bcrypt.compare(password, user.hash);
    
    return credentialsValid;
}

async function authenticateSessionId(sessionId) {
    const userId = await database.readUserIdFromActiveSession(sessionId);

    return userId;
}

const authentication = { authenticateCredentials, authenticateSessionId };
export default authentication;

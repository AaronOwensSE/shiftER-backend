// =================================================================================================
// External Dependencies
// =================================================================================================
import bcrypt from "bcrypt";
import crypto from "crypto";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../constants.js";
import errors from "../errors.js";
import validation from "./validation.js";
import database from "../database/database.js";

// =================================================================================================
// Public API
// =================================================================================================
async function logIn(userId, password) {
    if (!validation.isValidUserId(userId) || !validation.isValidUserPassword(password)) {
        throw new errors.ValidationError();
    }
    
    if (!await authenticateCredentials(userId, password)) {
        throw new errors.InvalidCredentialsError();
    }
    
    try {
        await database.deleteSessionsByUserId(userId);
    } catch (error) {
        if (!(error instanceof errors.ResourceDoesNotExistError)) { // Recoverable
            throw error;
        }
    }

    const sessionId = await getNewSessionId(userId);

    return sessionId;
}

async function authenticateSession(sessionId) {
    if (!validation.isValidSessionId(sessionId)) {
        throw new errors.ValidationError();
    }

    const userId = await database.readUserIdFromActiveSession(sessionId);

    return userId;
}

async function logOut(sessionId) {
    if (!validation.isValidSessionId(sessionId)) {
        throw new errors.ValidationError();
    }

    return await database.deleteSession(sessionId);
}

const authenticationService = { logIn, authenticateSession, logOut };
export default authenticationService;

// =================================================================================================
// Helper Functions
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

async function getNewSessionId(userId) {
    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);
    
    for (let i = 0, sessionId, createSessionResult; i < constants.SESSION_ID_ATTEMPTS; i++) {
        sessionId = crypto.randomBytes(constants.SESSION_ID_LENGTH_IN_BYTES).toString("hex");

        try {
            createSessionResult = await database.createSession(sessionId, userId, expires);
        } catch (error) {
            if (error instanceof errors.ResourceAlreadyExistsError) {
                continue;
            } else {
                throw error;
            }
        }

        return createSessionResult;
    }

    throw new errors.TooManyAttemptsError();
}

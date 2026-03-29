// =================================================================================================
// External Dependencies
// =================================================================================================
import crypto from "crypto";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import errors from "../../errors.js";
import authentication from "../authentication.js";
import validation from "../validation.js";
import database from "../../database/database.js";

// =================================================================================================
// Public API
// =================================================================================================
async function logIn(userId, password) {
    if (!validation.isValidUserId(userId) || !validation.isValidUserPassword(password)) {
        throw new errors.ValidationError();
    }
    
    if (!await authentication.authenticateCredentials(userId, password)) {
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

async function resumeSession(sessionId) {
    if (!validation.isValidSessionId(sessionId)) {
        throw new errors.ValidationError();
    }

    const userId = await authentication.authenticateSessionId(sessionId);

    return userId;
}

async function logOut(sessionId) {
    if (!validation.isValidSessionId(sessionId)) {
        throw new errors.ValidationError();
    }

    return await database.deleteSession(sessionId);
}

const sessionService = { logIn, resumeSession, logOut };
export default sessionService;

// =================================================================================================
// Helper Functions
// =================================================================================================
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

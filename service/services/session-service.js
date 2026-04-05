// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import serviceErrors from "../service-errors.js";
import authentication from "../authentication.js";
import crypt from "../crypt.js";
import validation from "../validation.js";
import database from "../../database/database.js";
import databaseErrors from "../../database/database-errors.js";

// =================================================================================================
// Public API
// =================================================================================================
async function logIn(userId, password) {
    if (!validation.isValidUserId(userId) || !validation.isValidUserPassword(password)) {
        throw new serviceErrors.InvalidInputError();
    }
    
    if (!await authentication.authenticateCredentials(userId, password)) {
        throw new serviceErrors.UnableToAuthenticateError();
    }
    
    try {
        await database.deleteSessionsByUserId(userId);
    } catch (error) {
        if (!(error instanceof databaseErrors.EntryDoesNotExistError)) { // Recoverable
            throw error;
        }
    }

    const sessionId = await getNewSessionId(userId);

    return sessionId;
}

async function resumeSession(sessionId) {
    if (!validation.isValidSessionId(sessionId)) {
        throw new serviceErrors.InvalidInputError();
    }

    const userId = await authentication.authenticateSessionId(sessionId);

    return userId;
}

async function logOut(sessionId) {
    if (!validation.isValidSessionId(sessionId)) {
        throw new serviceErrors.InvalidInputError();
    }

    try {
        await database.deleteSession(sessionId);
    } catch (error) {
        if (error instanceof databaseErrors.EntryDoesNotExistError) {
            throw new serviceErrors.UnableToAuthenticateError();
        } else {
            throw error;
        }
    }
}

const sessionService = { logIn, resumeSession, logOut };
export default sessionService;

// =================================================================================================
// Helper Functions
// =================================================================================================
async function getNewSessionId(userId) {
    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);
    let randomBytes, sessionId;
    
    for (let i = 0; i < constants.SESSION_ID_ATTEMPTS; i++) {
        randomBytes = crypt.generateRandomBytes(constants.SESSION_ID_LENGTH_IN_BYTES);
        sessionId = randomBytes.toString("hex");

        try {
            await database.createSession(sessionId, userId, expires);
        } catch (error) {
            if (error instanceof databaseErrors.EntryAlreadyExistsError) {
                continue;
            } else {
                throw error;
            }
        }

        return sessionId;
    }

    throw new serviceErrors.TooManyAttemptsError();
}

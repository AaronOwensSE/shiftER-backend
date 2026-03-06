// =================================================================================================
// External Dependencies
// =================================================================================================
import bcrypt from "bcrypt";
import crypto from "crypto";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../constants.js";
import errorHandling from "../error-handling.js";
import sessionModel from "../db/models/session-model.js";
import userModel from "../db/models/user-model.js";

// =================================================================================================
// Public API
// =================================================================================================
async function logIn(id, password) {
    const result = new errorHandling.Result();
    const genericMessage = "Unable to log in.";

    const credentialsValid = await authenticateCredentials(id, password);

    if (!credentialsValid) {
        result.ok = false;
        result.message = genericMessage;

        return result;
    }

    const getSessionIdResult = await getSessionId(id);

    if (!getSessionIdResult.ok) {
        result.ok = false;
        result.message = genericMessage;

        return result;
    }

    const sessionId = getSessionIdResult.value;
    result.ok = true;
    result.value = sessionId;

    return result;
}

async function authenticateSession(id) {
    const result = new errorHandling.Result();
    const readSessionResult = await sessionModel.readSession(id);
    const genericMessage = "Unable to authenticate session.";

    if (readSessionResult.ok) {
        const now = new Date();
        /*
        
        Separation of concerns:

        This layer of the app should not know what DB rows are. They should have been packaged into
        a simple JS object before reaching here.

        */
        const expires = new Date(readSessionResult.value.rows[0].expires);

        if (expires > now) {
            result.ok = true;
        } else {
            sessionModel.deleteSession(id);

            result.ok = false;
            result.message = genericMessage;
        }
    } else {
        result.ok = false;
        result.message = genericMessage;
    }

    return result;
}

async function logOut(id) {
    const result = new errorHandling.Result();
    const deleteSessionResult = await sessionModel.deleteSession(id);

    if (deleteSessionResult.ok) {
        result.ok = true;
    } else {
        result.ok = false;
        result.message = "Unable to log out.";
    }

    return result;
}

const authenticationController = { logIn, authenticateSession, logOut };
export default authenticationController;

export const testing =
    process.env.NODE_ENV === "test" ?
    { logIn, authenticateSession, logOut, authenticateCredentials, getSessionId }
    : {};

// =================================================================================================
// Helper Functions
// =================================================================================================
async function authenticateCredentials(userId, password) {
    const result = await userModel.readUser(userId);

    if (!result.ok) {
        return false;
    }

    const credentialsValid = await bcrypt.compare(password, result.value.rows[0].hash);

    return credentialsValid;
}

async function getSessionId(userId) {
    const result = new errorHandling.Result();
    result.ok = false;

    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);

    for (let i = 0, sessionId, createSessionResult; i < constants.SESSION_ID_ATTEMPTS; i++) {
        sessionId = crypto.randomBytes(constants.SESSION_ID_LENGTH_IN_BYTES).toString("hex");
        createSessionResult = await sessionModel.createSession(sessionId, userId, expires);

        if (createSessionResult.ok) {
            result.ok = true;
            result.value = sessionId;

            break;
        }
    }

    return result;
}

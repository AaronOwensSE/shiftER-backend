"use strict";

// External Dependencies
import bcrypt from "bcrypt";
import "crypto";

// Internal Modules
import constants from "../constants.js";
import errorHandling from "../error-handling.js";
import sessionModel from "../db/models/session-model.js";

// Exports
async function logIn(userId, password) {
    const result = new errorHandling.Result();
    const genericMessage = "Unable to log in.";

    const credentialsValid = await authenticateCredentials(userId, password);

    if (!credentialsValid) {
        result.ok = false;
        result.message = genericMessage;

        return result;
    }

    const deleteSessionsByUserIdResult = await sessionModel.deleteSessionsByUserId(userId);

    if (!deleteSessionsByUserIdResult.ok) {
        result.ok = false;
        result.message = genericMessage;

        return result;
    }

    const getSessionIdResult = await getSessionId(userId);

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

const authenticationController = { logIn };
export default authenticationController;

export const testing =
    process.env.NODE_ENV === "test" ?
    { logIn, authenticateCredentials, getSessionId }
    : {};

// Helper Functions
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
        sessionId = crypto.randomBytes(SESSION_ID_LENGTH_IN_BYTES).toString("hex");
        createSessionResult = await createSession(sessionId, userId, expires);

        if (createSessionResult.ok) {
            result.ok = true;
            result.value = sessionId;

            break;
        }
    }

    return result;
}

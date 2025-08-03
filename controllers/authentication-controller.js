"use strict";

// External Dependencies
import bcrypt from "bcrypt";
import "crypto";

// Internal Modules
import "../constants.js";
import sessionModel from "../db/models/session-model.js";

// Be mindful not to pass detailed backend error outputs on to frontend. A user should not be able
// to gain information about the system or credentials by observing error messages. Consider
// removing even backend error details after testing. Research best practices.

// Exports
async function logIn(userId, password) {
    console.log(`Log in: ${userId, password}`);

    if (!authenticateCredentials(userId, password)) {
        console.error("Unable to log in: Invalid credentials.");

        return false;
    }

    if (!sessionModel.deleteUserSessions(userId)) {
        console.error("Unable to log in: Unable to delete prior user sessions.");

        return false;
    }
    
    const sessionId = await getUniqueSessionId();

    if (!sessionId) {
        console.error("Unable to log in: Unable to acquire unique session ID.");

        return false;
    }
    
    // insert session id to db
    // set cookie containing session ID with same expiration
    // return true/false
}

const authenticationController = { logIn };
export default authenticationController;

// Helper Functions
async function authenticateCredentials(userId, password) {
    console.log(`Authenticate credentials: ${userId}`);

    try {
        const result = await sessionModel.readUser(userId);

        if (result.rowCount <= 0) {
            console.error("Authenticate credentials failed: User does not exist.");

            return false;
        }

        const credentialsValid = await bcrypt.compare(password, result.rows[0].hash);

        if (credentialsValid) {
            console.log("Authenticate credentials succeeded.");

            return true;
        } else {
            console.error("Authenticate credentials failed: Incorrect password.");

            return false;
        }
    } catch (error) {
        console.error(`Authenticate user failed: ${error.message}`);

        return false;
    }
}

async function getUniqueSessionId() {
    console.log("Get unique session ID.");

    let sessionId;

    for (let i = 0; i < SESSION_ID_ATTEMPTS; i++) {
        sessionId = crypto.randomBytes(SESSION_ID_LENGTH_IN_BYTES).toString("hex");

        try {
            if (!(await sessionIdExists(sessionId))) {
                return sessionId;
            }
        } catch (error) {
            console.error(`Get unique session ID failed: ${error.message}`);

            return false;
        }
    }

    console.error(
        `Get unique session ID failed: 
        Unable to acquire unique session ID in ${SESSION_ID_ATTEMPTS} attempts.`
    );

    return false;
}

async function sessionIdExists(id) {
    console.log("Session ID exists?");

    try {
        const result = await readSession(id);

        return result.rowCount > 0;
    } catch (error) {
        console.error(`Session ID exists? failed: ${error.message}`);

        throw Error("Read session failed.");
    }
}

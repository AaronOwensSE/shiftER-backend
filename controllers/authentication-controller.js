"use strict";

// External Dependencies
import bcrypt from "bcrypt";

// Internal Modules
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
    
    // create unique session ID
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

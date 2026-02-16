// =================================================================================================
// Internal Dependencies
// =================================================================================================
import authenticationController from "./authentication-controller.js";
import crypt from "../crypt.js";
import errorHandling from "../error-handling.js";
import validation from "../validation.js";
import userModel from "../db/models/user-model.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser({ id, password, name, email }) {
    const result = new errorHandling.Result();

    if (!validation.isValidUser({ id, password, name, email} )) {
        result.ok = false;
        result.message = "Invalid user.";

        return result;
    }

    const readUserResult = await userModel.readUser(id);

    if (readUserResult.ok) {
        result.ok = false;
        result.message = "User already exists.";

        return result;
    }

    const hash = await crypt.generateHash(password);
    const createUserResult = await userModel.createUser({ id, hash, name, email });

    if (createUserResult.ok) {
        result.ok = true;
    } else {
        result.ok = false;
        result.message = "Create user failed.";
    }

    return result;
}

async function getUserProfile(sessionId) {
    /*
    Summary of the problem right now:

    There's ambiguity as to where authentication should occur and what it should return. Of course,
    it should occur in the authentication controller. Do we want different functions for the simple
    boolean return authentication we use to determine which screen to display vs. authentication
    that needs to return identity so we can make a subsequent request for a resource associated with
    that identity? Does some of this get broken out to the user controller? Are new model functions
    needed, or are we going to deal with multiple queries here in the controller? Etc.
    */



    const result = new errorHandling.Result();
    // authenticate session ID and retrieve user ID
    const authenticateSessionResult = await authenticationController.authenticateSession(sessionId);

    // read userID
    // this should be a join. select (user_id, name, email) from sessions join users where sessions.id = $1 and sessions.user_id = users.user_id)

    return result;
}

const userController = { createUser };
export default userController;

export const testing =
    process.env.NODE_ENV === "test" ?
    { createUser }
    : {};

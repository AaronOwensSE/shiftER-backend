// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../../errors.js";
import authentication from "../authentication.js";
import crypt from "../crypt.js";
import validation from "../validation.js";
import database from "../../database/database.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    if (!validation.isValidUser(user)) {
        throw new errors.ValidationError();
    }

    const { id, password, name, email } = user;
    const hash = await crypt.generateHash(password);
    const dbReadyUser = { id: id, hash: hash, name: name, email: email };

    return await database.createUser(dbReadyUser);
}

async function retrieveUserProfile(sessionId, userId) {
    if (!validation.isValidSessionId(sessionId) || !validation.isValidUserId(userId)) {
        throw new errors.ValidationError();
    }

    const authenticatedUserId = await authentication.authenticateSessionId(sessionId);

    if (userId !== authenticatedUserId) {
        throw new errors.UnauthorizedAccessError();
    }

    const user = await database.readUser(userId);
    const userProfile = { userId: user.id, userName: user.name, userEmail: user.email };

    return userProfile;
}

async function deleteUser(sessionId, userId) {
    if (!validation.isValidSessionId(sessionId) || !validation.isValidUserId(userId)) {
        throw new errors.ValidationError();
    }

    const authenticatedUserId = await authentication.authenticateSessionId(sessionId);

    if (userId !== authenticatedUserId) {
        throw new errors.UnauthorizedAccessError();
    }

    await database.deleteSessionsByUserId(userId);
    // Manually cascade further? DB should be set to cascade, but redundancy might be a good idea.

    return await database.deleteUser(userId);
}

const userService = { createUser, retrieveUserProfile, deleteUser };
export default userService;

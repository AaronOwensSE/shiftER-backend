// =================================================================================================
// Internal Dependencies
// =================================================================================================
import authentication from "../authentication.js";
import crypt from "../crypt.js";
import serviceErrors from "../service-errors.js";
import validation from "../validation.js";
import database from "../../database/database.js";
import databaseErrors from "../../database/database-errors.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(user) {
    if (!validation.isValidUser(user)) {
        throw new serviceErrors.InvalidInputError();
    }

    const { id, password, name, email } = user;
    const hash = await crypt.generateHash(password);
    const dbReadyUser = { id: id, hash: hash, name: name, email: email };

    try {
        await database.createUser(dbReadyUser);
    } catch (error) {
        if (error instanceof databaseErrors.EntryAlreadyExistsError) {
            throw new serviceErrors.ResourceAlreadyExistsError();
        } else {
            throw error;
        }
    }
}

async function retrieveUserProfile(sessionId, userId) {
    if (!validation.isValidSessionId(sessionId) || !validation.isValidUserId(userId)) {
        throw new serviceErrors.InvalidInputError();
    }

    const authenticatedUserId = await authentication.authenticateSessionId(sessionId);

    if (userId !== authenticatedUserId) {
        throw new serviceErrors.UnauthorizedAccessError();
    }

    let user;

    try {
        user = await database.readUser(userId);
    } catch (error) {
        if (error instanceof databaseErrors.EntryDoesNotExistError) {
            throw new serviceErrors.ResourceDoesNotExistError();
        } else {
            throw error;
        }
    }
    
    const userProfile = { userId: user.id, userName: user.name, userEmail: user.email };

    return userProfile;
}

async function deleteUser(sessionId, userId) {
    if (!validation.isValidSessionId(sessionId) || !validation.isValidUserId(userId)) {
        throw new serviceErrors.InvalidInputError();
    }

    const authenticatedUserId = await authentication.authenticateSessionId(sessionId);

    if (userId !== authenticatedUserId) {
        throw new serviceErrors.UnauthorizedAccessError();
    }

    // Manually cascade further? DB should be set to cascade, but redundancy might be a good idea.
    try {
        await database.deleteSessionsByUserId(userId);
    } catch (error) {
        if (!(error instanceof databaseErrors.EntryDoesNotExistError)) {    // Recoverable
            throw error;
        }
    }

    try {
        database.deleteUser(userId);
    } catch (error) {
        if (error instanceof databaseErrors.EntryDoesNotExistError) {
            throw new serviceErrors.ResourceDoesNotExistError();
        } else {
            throw error;
        }
    }
}

const userService = { createUser, retrieveUserProfile, deleteUser };
export default userService;

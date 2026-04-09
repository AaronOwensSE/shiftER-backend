// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import authentication from "../authentication.js";
import crypt from "../crypt.js";
import sanitization from "../sanitization.js";
import serviceErrors from "../service-errors.js";
import validation from "../validation.js";
import database from "../../database/database.js";
import databaseErrors from "../../database/database-errors.js";

// =================================================================================================
// Public API
// =================================================================================================
/**
 * @throws {InvalidInputError}
 * @throws {ResourceAlreadyExistsError}
 */
async function createUser(user) {
    const sanitizedUser = sanitization.sanitizedObject(user, constants.CREATE_USER_ALLOWED_FIELDS);

    if (!validation.isValidUser(sanitizedUser)) {
        throw new serviceErrors.InvalidInputError();
    }

    const dbReadyUser = await replacePasswordWithHash(sanitizedUser);

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

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {UnauthorizedAccessError}
 * @throws {ResourceDoesNotExistError}
 */
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

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {UnauthorizedAccessError}
 * @throws {ResourceDoesNotExistError}
 */
async function updateUserProfile(sessionId, userId, updates) {
    const sanitizedUpdates = sanitization.sanitizedObject(
        updates, constants.UPDATE_USER_ALLOWED_FIELDS
    );

    if (!validation.isValidSessionId(sessionId)
        || !validation.isValidUserId(userId)
        || !validation.isValidUserUpdate(sanitizedUpdates))
    {
        throw new serviceErrors.InvalidInputError();
    }

    const authenticatedUserId = await authentication.authenticateSessionId(sessionId);

    if (userId !== authenticatedUserId) {
        throw new serviceErrors.UnauthorizedAccessError();
    }

    const dbReadyUpdates = await replacePasswordWithHash(sanitizedUpdates);

    try {
        await database.updateUser(userId, dbReadyUpdates);
    } catch (error) {
        if (error instanceof databaseErrors.EntryDoesNotExistError) {
            throw new serviceErrors.ResourceDoesNotExistError();
        } else {
            throw error;
        }
    }
}

/**
 * @throws {InvalidInputError}
 * @throws {UnableToAuthenticateError}
 * @throws {UnauthorizedAccessError}
 * @throws {ResourceDoesNotExistError}
 */
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

const userService = { createUser, retrieveUserProfile, updateUserProfile, deleteUser };
export default userService;

//==================================================================================================
// Helper Functions
//==================================================================================================
async function replacePasswordWithHash(userFields) {
    let updatedUserFields = userFields;

    if (Object.hasOwn(updatedUserFields, "password")) {
        updatedUserFields.hash = await crypt.generateHash(userFields.password);
        delete updatedUserFields.password;
    }

    return updatedUserFields;
}

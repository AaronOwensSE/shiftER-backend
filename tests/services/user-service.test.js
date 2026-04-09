// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import testConstants from "../test-constants.js";
import testUtilities from "../test-utilities.js";
import pool from "../../database/pool.js";
import serviceErrors from "../../service/service-errors.js";
import userService from "../../service/services/user-service.js";
import service from "../../service/service.js";

// =================================================================================================
// Setup/Teardown
// =================================================================================================
afterAll( async () => {
    await pool.end();
});

beforeEach( async () => {
    await pool.query("BEGIN;");
});

afterEach( async () => {
    await pool.query("ROLLBACK;");
});

// =================================================================================================
// Test Set
// =================================================================================================
test("createUser 1: Success", async () => {
    const id = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    const password = testConstants.TEST_USER_PASSWORD;
    const name = testConstants.TEST_USER_NAME;
    const email = testConstants.TEST_USER_EMAIL;
    user = { id, password, name, email };
    
    await expect(userService.createUser(user)).resolves.not.toThrow();
});

test("createUser 2: InvalidInputError", async () => {
    const user = { id: "a", password: 2, name: false };

    await expect(userService.createUser(user)).rejects.toThrow(serviceErrors.InvalidInputError);
});

test("createUser 3: ResourceAlreadyExistsError", async () => {
    const id = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    const password = testConstants.TEST_USER_PASSWORD;
    const name = testConstants.TEST_USER_NAME;
    const email = testConstants.TEST_USER_EMAIL;
    user = { id, password, name, email };
    await userService.createUser(user);

    await expect(userService.createUser(user))
        .rejects
        .toThrow(serviceErrors.ResourceAlreadyExistsError);
});

test("retrieveUserProfile 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const user = await userService.retrieveUserProfile(sessionId, userId);

    expect(user.userId).toBe(userId);
    expect(user.userName).toBe(testConstants.TEST_USER_NAME);
    expect(user.userEmail).toBe(testConstants.TEST_USER_EMAIL);
});

test("retrieveUserProfile 2: InvalidInputError", async () => {
    const sessionId = false;
    const userId = 5;

    await expect(userService.retrieveUserProfile(sessionId, userId))
        .rejects
        .toThrow(serviceErrors.InvalidInputError);
});

test("retrieveUserProfile 3: UnableToAuthenticateError", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);
    const userId = await testUtilities.createRandomUser();

    await expect(userService.retrieveUserProfile(sessionId, userId))
        .rejects
        .toThrow(serviceErrors.UnableToAuthenticateError);
});

test("retrieveUserProfile 4: UnauthorizedAccessError", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const unauthorizedUserId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userService.retrieveUserProfile(sessionId, unauthorizedUserId))
        .rejects
        .toThrow(serviceErrors.UnauthorizedAccessError);
});

// retrieveUserProfile 4: ResourceDoesNotExistError
// Should not be reachable unless logic expanded to allow retrieval of other users.

test("updateUserProfile 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const updates = { name: "bob", email: "bob@example.com" };

    await expect(userService.updateUserProfile(sessionId, userId, updates)).resolves.not.toThrow();
});

test("updateUserProfile 2: InvalidInputError", async () => {
    const userId = 5;
    const sessionId = false;
    const updates = { notAField: "asdf" };

    await expect(userService.updateUserProfile(sessionId, userId, updates))
        .rejects
        .toThrow(serviceErrors.InvalidInputError);
});

test("updateUserProfile 3: UnableToAuthenticateError", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);
    const updates = { name: "bob", email: "bob@example.com" };

    await expect(userService.updateUserProfile(sessionId, userId, updates))
        .rejects
        .toThrow(serviceErrors.UnableToAuthenticateError);
});

test("updateUserProfile 4: UnauthorizedAccessError", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const updates = { name: "bob", email: "bob@example.com" };
    const unauthorizedUserId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userService.updateUserProfile(sessionId, unauthorizedUserId, updates))
        .rejects
        .toThrow(serviceErrors.UnauthorizedAccessError);
});

// updateUserProfile 5: ResourceDoesNotExistError
// Should not be reachable unless logic expanded to allow update of other users.

test("deleteUser 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);

    await expect(userService.deleteUser(sessionId, userId)).resolves.not.toThrow();
});

test("deleteUser 2: InvalidInputError", async () => {
    const userId = false;
    const sessionId = 12;

    await expect(userService.deleteUser(sessionId, userId))
        .rejects
        .toThrow(serviceErrors.InvalidInputError);
});

test("deleteUser 3: UnableToAuthenticateError", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(userService.deleteUser(sessionId, userId))
        .rejects
        .toThrow(serviceErrors.UnableToAuthenticateError);
});

test("deleteUser 4: UnauthorizedAccessError", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const unauthorizedUserId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userService.deleteUser(sessionId, unauthorizedUserId))
        .rejects
        .toThrow(serviceErrors.UnauthorizedAccessError);
});

// deleteUser 5: ResourceDoesNotExistError
// Should not be reachable unless logic expanded to allow deletion of other users.

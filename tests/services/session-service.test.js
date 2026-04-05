// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import testConstants from "../test-constants.js";
import testUtilities from "../test-utilities.js";
import serviceErrors from "../../service/service-errors.js";
import sessionService from "../../service/services/session-service.js";
import pool from "../../database/pool.js";

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
test("logIn 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await sessionService.logIn(userId, testConstants.TEST_USER_PASSWORD);

    expect(typeof sessionId).toBe("string");
});

test("logIn 2: InvalidInputError", async () => {
    const userId = false;
    const password = 5;

    await expect(sessionService.logIn(userId, password))
        .rejects
        .toThrow(serviceErrors.InvalidInputError);
});

test("logIn 3: UnableToAuthenticateError", async () => {
    //await testUtilities.createRandomUser();
    const userId = await testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    
    await expect(sessionService.logIn(userId, testConstants.TEST_USER_PASSWORD))
        .rejects
        .toThrow(serviceErrors.UnableToAuthenticateError);
});

test("resumeSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const returnedUserId = await sessionService.resumeSession(sessionId);

    expect(returnedUserId).toBe(userId);
});

test("resumeSession 2: InvalidInputError", async () => {
    const sessionId = false;

    await expect(sessionService.resumeSession(sessionId))
        .rejects
        .toThrow(serviceErrors.InvalidInputError);
});

test("resumeSession 3: UnableToAuthenticateError", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(sessionService.resumeSession(sessionId))
        .rejects
        .toThrow(serviceErrors.UnableToAuthenticateError);
});

test("logOut 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);

    await expect(sessionService.logOut(sessionId)).resolves.not.toThrow();
});

test("logOut 2: InvalidInputError", async () => {
    const sessionId = 5;

    await expect(sessionService.logOut(sessionId)).rejects.toThrow(serviceErrors.InvalidInputError);
});

test("logOut 3: UnableToAuthenticateError", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(sessionService.logOut(sessionId))
        .rejects
        .toThrow(serviceErrors.UnableToAuthenticateError);
});

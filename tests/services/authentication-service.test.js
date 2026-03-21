// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import errors from "../../errors.js";
import testConstants from "../test-constants.js";
import testUtilities from "../test-utilities.js";
import authenticationService from "../../services/authentication-service.js";
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
    const sessionId = await authenticationService.logIn(userId, testConstants.TEST_USER_PASSWORD);

    expect(typeof sessionId).toBe("string");
});

test("logIn 2: Validation Error", async () => {
    const userId = false;
    const password = 5;

    await expect(authenticationService.logIn(userId, password))
        .rejects
        .toThrow(errors.ValidationError);
});

test("logIn 3: Invalid Credentials", async () => {
    await testUtilities.createRandomUser();
    const userId = await testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    
    await expect(authenticationService.logIn(userId, testConstants.TEST_USER_PASSWORD))
        .rejects
        .toThrow(errors.InvalidCredentialsError);
});

test("authenticateSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const returnedUserId = await authenticationService.authenticateSession(sessionId);

    expect(returnedUserId).toBe(userId);
});

test("authenticateSession 2: Validation Error", async () => {
    const sessionId = false;

    await expect(authenticationService.authenticateSession(sessionId))
        .rejects
        .toThrow(errors.ValidationError);
});

test("logOut 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const success = await authenticationService.logOut(sessionId);

    expect(success).toBe(true);
});

test("logOut 2: Validation Error", async () => {
    const sessionId = 5;

    await expect(authenticationService.logOut(sessionId)).rejects.toThrow(errors.ValidationError);
});

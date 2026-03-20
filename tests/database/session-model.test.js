// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import errors from "../../errors.js";
import testUtilities from "../test-utilities.js";
import pool from "../../database/pool.js";
import sessionModel from "../../database/session-model.js";

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
test("createSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);
    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);
    const returnedSessionId = await sessionModel.createSession(sessionId, userId, expires);

    expect(returnedSessionId).toBe(sessionId);
});

test("createSession 2: Resource Already Exists", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);

    await expect(sessionModel.createSession(sessionId, userId, expires))
        .rejects
        .toThrow(errors.ResourceAlreadyExistsError);
});

test("readUserIdFromActiveSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const returnedUserId = await sessionModel.readUserIdFromActiveSession(sessionId);

    expect(returnedUserId).toBe(userId);
});

test("readUserIdFromActiveSession 2: Resource Does Not Exist", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(sessionModel.readUserIdFromActiveSession(sessionId))
        .rejects
        .toThrow(errors.ResourceDoesNotExistError);
});

test("deleteSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const success = await sessionModel.deleteSession(sessionId);

    expect(success).toBe(true);
});

test("deleteSession 2: Resource Does Not Exist", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(sessionModel.deleteSession(sessionId))
        .rejects
        .toThrow(errors.ResourceDoesNotExistError);
});

test("deleteSessionsByUserId 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    await testUtilities.createRandomSession(userId);
    await testUtilities.createRandomSession(userId);
    const success = await sessionModel.deleteSessionsByUserId(userId);

    expect(success).toBe(true);
});

test("deleteSessionsByUserId 2: Resource Does Not Exist", async () => {
    const userId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(sessionModel.deleteSessionsByUserId(userId))
        .rejects
        .toThrow(errors.ResourceDoesNotExistError);
});

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import testUtilities from "../test-utilities.js";
import databaseErrors from "../../database/database-errors.js";
import pool from "../../database/pool.js";
import sessionRepository from "../../database/repositories/session-repository.js";

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

    await expect(sessionRepository.createSession(sessionId, userId, expires))
        .resolves
        .not
        .toThrow();
});

test("createSession 2: EntryAlreadyExistsError", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);

    await expect(sessionRepository.createSession(sessionId, userId, expires))
        .rejects
        .toThrow(databaseErrors.EntryAlreadyExistsError);
});

test("readUserIdFromActiveSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);
    const returnedUserId = await sessionRepository.readUserIdFromActiveSession(sessionId);

    expect(returnedUserId).toBe(userId);
});

test("readUserIdFromActiveSession 2: EntryDoesNotExistError", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(sessionRepository.readUserIdFromActiveSession(sessionId))
        .rejects
        .toThrow(databaseErrors.EntryDoesNotExistError);
});

test("deleteSession 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const sessionId = await testUtilities.createRandomSession(userId);

    await expect(sessionRepository.deleteSession(sessionId)).resolves.not.toThrow();
});

test("deleteSession 2: EntryDoesNotExistError", async () => {
    const sessionId = testUtilities.generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);

    await expect(sessionRepository.deleteSession(sessionId))
        .rejects
        .toThrow(databaseErrors.EntryDoesNotExistError);
});

test("deleteSessionsByUserId 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    await testUtilities.createRandomSession(userId);
    await testUtilities.createRandomSession(userId);

    await expect(sessionRepository.deleteSessionsByUserId(userId)).resolves.not.toThrow();
});

test("deleteSessionsByUserId 2: EntryDoesNotExistError", async () => {
    const userId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(sessionRepository.deleteSessionsByUserId(userId))
        .rejects
        .toThrow(databaseErrors.EntryDoesNotExistError);
});

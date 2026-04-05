// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import testConstants from "../test-constants.js";
import testUtilities from "../test-utilities.js";
import crypt from "../../service/crypt.js";
import databaseErrors from "../../database/database-errors.js";
import pool from "../../database/pool.js";
import userRepository from "../../database/repositories/user-repository.js";

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
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    const hash = await crypt.generateHash(testConstants.TEST_USER_PASSWORD);

    const testUser = {
        id: randomId,
        hash: hash,
        name: testConstants.TEST_USER_NAME,
        email: testConstants.TEST_USER_EMAIL
    };

    await expect(userRepository.createUser(testUser)).resolves.not.toThrow();
});

test("createUser 2: Failure: EntryAlreadyExistsError", async () => {
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    const hash = await crypt.generateHash(testConstants.TEST_USER_PASSWORD);

    const testUser = {
        id: randomId,
        hash: hash,
        name: testConstants.TEST_USER_NAME,
        email: testConstants.TEST_USER_EMAIL
    };

    await userRepository.createUser(testUser);

    await expect(userRepository.createUser(testUser))
        .rejects
        .toThrow(databaseErrors.EntryAlreadyExistsError);
});

test("readUser 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();
    const retrievedUser = await userRepository.readUser(userId);

    expect(retrievedUser.id).toBe(userId);
});

test("readUser 2: Failure: EntryDoesNotExistError", async () => {
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userRepository.readUser(randomId))
        .rejects
        .toThrow(databaseErrors.EntryDoesNotExistError);
});

test("deleteUser 1: Success", async () => {
    const userId = await testUtilities.createRandomUser();

    await expect(userRepository.deleteUser(userId)).resolves.not.toThrow();
});

test("deleteUser 2: EntryDoesNotExistError", async () => {
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userRepository.deleteUser(randomId))
        .rejects
        .toThrow(databaseErrors.EntryDoesNotExistError);
});

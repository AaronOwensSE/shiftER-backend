// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import errors from "../../errors.js";
import testConstants from "../test-constants.js";
import testUtilities from "../test-utilities.js";
import crypt from "../../services/crypt.js";
import pool from "../../database/pool.js";
import userModel from "../../database/user-model.js";

// =================================================================================================
// Setup/Teardown
// =================================================================================================
afterAll( async () => {
    await pool.end();
});

beforeEach( async () => {
    pool.query("BEGIN;");
});

afterEach( async () => {
    pool.query("ROLLBACK;");
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

    const userId = await userModel.createUser(testUser);

    expect(userId).toBe(randomId);
});

test("createUser 2: Failure: User Already Exists", async () => {
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    const hash = await crypt.generateHash(testConstants.TEST_USER_PASSWORD);

    const testUser = {
        id: randomId,
        hash: hash,
        name: testConstants.TEST_USER_NAME,
        email: testConstants.TEST_USER_EMAIL
    };

    await userModel.createUser(testUser);

    await expect(userModel.createUser(testUser)).rejects.toThrow(errors.ResourceAlreadyExistsError);
});

test("readUser 1: Success", async () => {
    const hash = await crypt.generateHash(testConstants.TEST_USER_PASSWORD);

    const testUser = {
        id: testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH),
        hash: hash,
        name: testConstants.TEST_USER_NAME,
        email: testConstants.TEST_USER_EMAIL
    };

    const userId = await userModel.createUser(testUser);
    const retrievedUser = await userModel.readUser(userId);

    expect(retrievedUser.id).toBe(testUser.id);
    expect(retrievedUser.hash).toBe(testUser.hash);
    expect(retrievedUser.name).toBe(testUser.name);
    expect(retrievedUser.email).toBe(testUser.email);
});

test("readUser 2: Failure: User Does Not Exist", async () => {
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userModel.readUser(randomId)).rejects.toThrow(errors.ResourceDoesNotExistError);
});

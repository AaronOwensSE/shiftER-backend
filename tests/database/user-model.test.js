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

    const userId = await userModel.createUser(testUser);

    expect(userId).toBe(randomId);
});

test("createUser 2: Failure: Resource Already Exists", async () => {
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
    const userId = await testUtilities.createRandomUser();
    const retrievedUser = await userModel.readUser(userId);

    expect(retrievedUser.id).toBe(userId);
});

test("readUser 2: Failure: Resource Does Not Exist", async () => {
    const randomId = testUtilities.generateRandomStringId(constants.USER_ID_MAX_LENGTH);

    await expect(userModel.readUser(randomId)).rejects.toThrow(errors.ResourceDoesNotExistError);
});

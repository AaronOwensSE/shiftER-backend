// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import errors from "../../errors.js";
import testConstants from "../test-constants.js";
import testUtilities from "../test-utilities.js";
import pool from "../../database/pool.js";
import userService from "../../services/user-service.js";

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
    const returnedUserId = await userService.createUser(user);

    expect(returnedUserId).toBe(id);
});

test("createUser 2: Validation Error", async () => {
    const user = { id: "a", password: 2, name: false };

    await expect(userService.createUser(user)).rejects.toThrow(errors.ValidationError);
});

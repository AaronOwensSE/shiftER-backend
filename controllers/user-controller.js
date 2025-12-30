// =================================================================================================
// Internal Dependencies
// =================================================================================================
import crypt from "../crypt.js";
import errorHandling from "../error-handling.js";
import validation from "../validation.js";
import userModel from "../db/models/user-model.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser({ id, password, name, email }) {
    const result = new errorHandling.Result();

    if (!validation.isValidUser({ id, password, name, email} )) {
        result.ok = false;
        result.message = "Invalid user.";

        return result;
    }

    const readUserResult = await userModel.readUser(id);

    if (readUserResult.ok) {
        result.ok = false;
        result.message = "User already exists.";

        return result;
    }

    const hash = await crypt.generateHash(password);
    const createUserResult = await userModel.createUser({ id, hash, name, email });

    if (createUserResult.ok) {
        result.ok = true;
    } else {
        result.ok = false;
        result.message = "Create user failed.";
    }

    return result;
}

const userController = { createUser };
export default userController;

export const testing =
    process.env.NODE_ENV === "test" ?
    { createUser }
    : {};

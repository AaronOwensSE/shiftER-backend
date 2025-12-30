// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "./constants.js";

// =================================================================================================
// Public API
// =================================================================================================
export function isValidUser({ id, password, name, email }) {
    return isValidUserId(id)
        && isValidUserPassword(password)
        && isValidUserName(name)
        && isValidUserEmail(email);
}

export function isValidUserId(id) {
    return typeof id == "string"
        && id.length >= constants.USER_ID_MIN_LENGTH
        && id.length <= constants.USER_ID_MAX_LENGTH;
}

export function isValidUserPassword(password) {
    return typeof password == "string"
        && password.length >= constants.USER_PASSWORD_MIN_LENGTH
        && password.length <= constants.USER_PASSWORD_MAX_LENGTH;
}

export function isValidUserName(name) {
    return typeof name == "string"
        && name.length >= constants.USER_NAME_MIN_LENGTH
        && name.length <= constants.USER_NAME_MAX_LENGTH;
}

export function isValidUserEmail(email) {
    return typeof email == "string"
        && email.length >= constants.USER_EMAIL_MIN_LENGTH
        && email.length <= constants.USER_EMAIL_MAX_LENGTH;
}

const validation = {
    isValidUser,
    isValidUserId,
    isValidUserPassword,
    isValidUserName,
    isValidUserEmail
};

export default validation;

export const testing =
    process.env.NODE_ENV == "test" ?
    {
        isValidUser,
        isValidUserId,
        isValidUserPassword,
        isValidUserName,
        isValidUserEmail
    }
    : {};

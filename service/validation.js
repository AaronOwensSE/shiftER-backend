// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../constants.js";

// =================================================================================================
// Public API
// =================================================================================================
function isValidUser({ id, password, name, email }) {
    return isValidUserId(id)
        && isValidUserPassword(password)
        && isValidUserName(name)
        && isValidUserEmail(email);
}

function isValidUserId(id) {
    return typeof id == "string"
        && id.length >= constants.USER_ID_MIN_LENGTH
        && id.length <= constants.USER_ID_MAX_LENGTH;
}

function isValidUserPassword(password) {
    return typeof password == "string"
        && password.length >= constants.USER_PASSWORD_MIN_LENGTH
        && password.length <= constants.USER_PASSWORD_MAX_LENGTH;
}

function isValidUserName(name) {
    return typeof name == "string"
        && name.length >= constants.USER_NAME_MIN_LENGTH
        && name.length <= constants.USER_NAME_MAX_LENGTH;
}

function isValidUserEmail(email) {
    return typeof email == "string"
        && email.length >= constants.USER_EMAIL_MIN_LENGTH
        && email.length <= constants.USER_EMAIL_MAX_LENGTH;
}

function isValidSessionId(sessionId) {
    return typeof sessionId == "string"
        && sessionId.length == constants.SESSION_ID_HEX_STRING_LENGTH;
}

const validation = {
    isValidUser,
    isValidUserId,
    isValidUserPassword,
    isValidUserName,
    isValidUserEmail,

    isValidSessionId
};

export default validation;

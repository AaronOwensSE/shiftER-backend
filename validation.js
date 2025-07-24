"use strict";

// Internal Modules
import {
    USER_ID_MIN_LENGTH,
    USER_ID_MAX_LENGTH,
    USER_PASSWORD_MIN_LENGTH,
    USER_PASSWORD_MAX_LENGTH,
    USER_NAME_MIN_LENGTH,
    USER_NAME_MAX_LENGTH,
    USER_EMAIL_MIN_LENGTH,
    USER_EMAIL_MAX_LENGTH,
} from "./constants.js";

// Exports
export function isValidUser(id, password, name, email) {
    return isValidUserId(id)
        && isValidUserPassword(password)
        && isValidUserName(name)
        && isValidUserEmail(email);
}

export function isValidUserId(id) {
    return typeof id == "string"
        && id.length >= USER_ID_MIN_LENGTH
        && id.length <= USER_ID_MAX_LENGTH;
}

export function isValidUserPassword(password) {
    return typeof password == "string"
        && password.length >= USER_PASSWORD_MIN_LENGTH
        && password.length <= USER_PASSWORD_MAX_LENGTH;
}

export function isValidUserName(name) {
    return typeof name == "string"
        && name.length >= USER_NAME_MIN_LENGTH
        && name.length <= USER_NAME_MAX_LENGTH;
}

export function isValidUserEmail(email) {
    return typeof email == "string"
        && email.length >= USER_EMAIL_MIN_LENGTH
        && email.length <= USER_EMAIL_MAX_LENGTH;
}

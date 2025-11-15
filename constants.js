"use strict";

// Users
const SALT_DEFAULT_ROUNDS = 10;

// Sessions
const SESSION_ID_LENGTH_IN_BYTES = 32;
const SESSION_ID_ATTEMPTS = 5;

const constants = {
    SALT_DEFAULT_ROUNDS,

    SESSION_ID_LENGTH_IN_BYTES,
    SESSION_ID_ATTEMPTS
};

export default constants;

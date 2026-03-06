// =================================================================================================
// Public API
// =================================================================================================

// Users
const USER_ID_MIN_LENGTH = 3;
const USER_ID_MAX_LENGTH = 30;
const USER_PASSWORD_MIN_LENGTH = 12;
const USER_PASSWORD_MAX_LENGTH = 30;
const USER_NAME_MIN_LENGTH = 3;
const USER_NAME_MAX_LENGTH = 60;
const USER_EMAIL_MIN_LENGTH = 7;
const USER_EMAIL_MAX_LENGTH = 254;
const SALT_DEFAULT_ROUNDS = 10;

// Sessions
const SESSION_ID_LENGTH_IN_BYTES = 32;
const SESSION_ID_ATTEMPTS = 10;
const SESSION_EXPIRATION = 1000 * 60 * 60 * 24 * 30;    // 30 days

// Groups
const GROUP_NAME_MIN_LENGTH = 3;
const GROUP_NAME_MAX_LENGTH = 30;

const constants = {
    USER_ID_MIN_LENGTH,
    USER_ID_MAX_LENGTH,
    USER_PASSWORD_MIN_LENGTH,
    USER_PASSWORD_MAX_LENGTH,
    USER_NAME_MIN_LENGTH,
    USER_NAME_MAX_LENGTH,
    USER_EMAIL_MIN_LENGTH,
    USER_EMAIL_MAX_LENGTH,
    SALT_DEFAULT_ROUNDS,

    SESSION_ID_LENGTH_IN_BYTES,
    SESSION_ID_ATTEMPTS,
    SESSION_EXPIRATION,

    GROUP_NAME_MIN_LENGTH,
    GROUP_NAME_MAX_LENGTH
};

export default constants;

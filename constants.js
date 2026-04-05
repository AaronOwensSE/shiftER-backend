// =================================================================================================
// Public API
// =================================================================================================

// HTTP Response Status Codes
const HTTP_200_OK = 200;
const HTTP_400_BAD_REQUEST = 400;
const HTTP_401_UNAUTHORIZED = 401;  // Better understood as unauthenticated.
const HTTP_403_FORBIDDEN = 403;     // Better understood as unauthorized.
const HTTP_404_NOT_FOUND = 404;
const HTTP_409_CONFLICT = 409;
const HTTP_500_INTERNAL_SERVER_ERROR = 500;

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
const SESSION_ID_HEX_STRING_LENGTH = SESSION_ID_LENGTH_IN_BYTES * 2;
const SESSION_ID_ATTEMPTS = 10;
const SESSION_EXPIRATION = 1000 * 60 * 60 * 24 * 30;    // 30 days

// Groups
const GROUP_NAME_MIN_LENGTH = 3;
const GROUP_NAME_MAX_LENGTH = 30;

// Database
const UNIQUE_CONSTRAINT_VIOLATION_CODE = "23505";

const constants = {
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
    
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
    SESSION_ID_HEX_STRING_LENGTH,
    SESSION_ID_ATTEMPTS,
    SESSION_EXPIRATION,

    GROUP_NAME_MIN_LENGTH,
    GROUP_NAME_MAX_LENGTH,

    UNIQUE_CONSTRAINT_VIOLATION_CODE
};

export default constants;

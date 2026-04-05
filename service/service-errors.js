// =================================================================================================
// Public API
// =================================================================================================
class InvalidInputError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidInputError";
    }
}

class ResourceAlreadyExistsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "ResourceAlreadyExistsError";
    }
}

class ResourceDoesNotExistError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "ResourceDoesNotExistError";
    }
}

class TooManyAttemptsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "TooManyAttemptsError";
    }
}

class UnableToAuthenticateError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "UnableToAuthenticateError";
    }
}

class UnauthorizedAccessError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "UnauthorizedAccessError";
    }
}

const serviceErrors = {
    InvalidInputError,
    ResourceAlreadyExistsError,
    ResourceDoesNotExistError,
    TooManyAttemptsError,
    UnableToAuthenticateError,
    UnauthorizedAccessError,
};

export default serviceErrors;

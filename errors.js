// =================================================================================================
// Public API
// =================================================================================================
class InvalidCredentialsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidCredentialsError";
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

class UnauthorizedAccessError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "UnauthorizedAccessError";
    }
}

class ValidationError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "ValidationError";
    }
}

const errors = {
    InvalidCredentialsError,
    ResourceAlreadyExistsError,
    ResourceDoesNotExistError,
    TooManyAttemptsError,
    UnauthorizedAccessError,
    ValidationError
};

export default errors;

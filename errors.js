// =================================================================================================
// Public API
// =================================================================================================
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

class InvalidCredentialsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}

class ValidationError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "ValidationError";
    }
}

const errors = {
    ResourceAlreadyExistsError,
    ResourceDoesNotExistError,
    InvalidCredentialsError,
    TooManyAttemptsError,
    ValidationError
};

export default errors;

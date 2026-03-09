// =================================================================================================
// Public API
// =================================================================================================

// Service Layer ===================================================================================
class ValidationError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "ValidationError";
    }
}

class InvalidCredentialsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}

// Database Layer ==================================================================================
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

// Export ==========================================================================================
const errors = {
    ValidationError,
    InvalidCredentialsError,
    ResourceAlreadyExistsError,
    ResourceDoesNotExistError
};

export default errors;

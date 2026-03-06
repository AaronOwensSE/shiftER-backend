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

// Database Layer ==================================================================================
class ResourceAlreadyExistsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "ResourceAlreadyExistsError";
    }
}

// Export ==========================================================================================
const errors = { ValidationError, ResourceAlreadyExistsError };
export default errors;

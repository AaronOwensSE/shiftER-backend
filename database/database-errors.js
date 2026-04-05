// =================================================================================================
// Public API
// =================================================================================================
class EntryAlreadyExistsError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "EntryAlreadyExistsError";
    }
}

class EntryDoesNotExistError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "EntryDoesNotExistError";
    }
}

const databaseErrors = { EntryAlreadyExistsError, EntryDoesNotExistError };
export default databaseErrors;

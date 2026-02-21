// =================================================================================================
// Public API
// =================================================================================================
class Result {
    constructor(ok = undefined, value = undefined, message = undefined) {
        this.ok = ok;
        this.value = value;
        this.message = message;
    }
}

const errorHandling = { Result };
export default errorHandling;

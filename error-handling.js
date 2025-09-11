class Result {
    constructor( { ok, value, message } ) {
        this.ok = ok;
        this.value = value;
        this.message = message;
    }
}

const errorHandling = { Result };
export default errorHandling;

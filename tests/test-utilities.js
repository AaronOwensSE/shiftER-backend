// =================================================================================================
// Public API
// =================================================================================================
function generateRandomStringId(length) {
    let randomString = "";

    while (randomString.length < length) {
        const randomDecimal = Math.random();    // Between 0 and 1
        const base36DecimalString = randomDecimal.toString(36); // 10 numerals + 26 letters
        const alphanumericString = base36DecimalString.slice(2);

        randomString += alphanumericString;
    }

    const randomStringId = randomString.slice(0, length);

    return randomStringId;
}

const testUtilities = { generateRandomStringId };
export default testUtilities;

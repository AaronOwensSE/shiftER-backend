// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../constants.js";
import testConstants from "./test-constants.js";
import crypt from "../service/crypt.js";
import sessionRepository from "../database/repositories/session-repository.js";
import userRepository from "../database/repositories/user-repository.js";

// =================================================================================================
// Public API
// =================================================================================================
function generateRandomStringId(length) {
    let randomString = "";

    while (randomString.length < length) {
        const randomDecimal = Math.random();                        // Between 0 and 1
        const base36DecimalString = randomDecimal.toString(36);     // 10 numerals + 26 letters
        const alphanumericString = base36DecimalString.slice(2);    // Removes "0.".

        randomString += alphanumericString;
    }

    const randomStringId = randomString.slice(0, length);

    return randomStringId;
}

async function createRandomUser() {
    const userId = generateRandomStringId(constants.USER_ID_MAX_LENGTH);
    const hash = await crypt.generateHash(testConstants.TEST_USER_PASSWORD);

    const user = {
        id: userId,
        hash: hash,
        name: testConstants.TEST_USER_NAME,
        email: testConstants.TEST_USER_EMAIL
    };
    
    await userRepository.createUser(user);

    return userId;
}

async function createRandomSession(userId) {
    const sessionId = generateRandomStringId(constants.SESSION_ID_HEX_STRING_LENGTH);
    const expires = new Date(Date.now() + constants.SESSION_EXPIRATION);
    await sessionRepository.createSession(sessionId, userId, expires);

    return sessionId;
}

const testUtilities = { generateRandomStringId, createRandomUser, createRandomSession };
export default testUtilities;

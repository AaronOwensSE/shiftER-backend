// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import service from "../service/service.js";

// =================================================================================================
// Public API
// =================================================================================================
async function postSession(req, res) {
    const { userId, password } = req.body;

    try {
        const responseBody = await service.logIn(userId, password);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(200);    // 200 OK
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.sendStatus(400);    // 400 Bad Request
        } else if (error instanceof errors.TooManyAttemptsError) {
            res.sendStatus(500);    // Internal Server Error
        } else if (error instanceof errors.InvalidCredentialsError) {
            res.sendStatus(401);    // 401 Unauthorized
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

async function getSession(req, res) {
    const bearerTokenHeader = req.header("Authorization");  // Format: "Bearer sessionID"
    const bearerTokenWords = bearerTokenHeader.split(" ");
    const sessionId = bearerTokenWords[1];

    try {
        const responseBody = await service.authenticateSession(sessionId);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(200);    // 200 OK
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.sendStatus(400);  // 400 Bad Request
        } else if (error instanceof errors.ResourceDoesNotExistError) {
            res.sendStatus(401);  // 401 Unauthorized
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

async function deleteSession(req, res) {
    const bearerTokenHeader = req.header("Authorization");  // Format: "Bearer sessionID"
    const bearerTokenWords = bearerTokenHeader.split(" ");
    const sessionId = bearerTokenWords[1];

    try {
        await service.logOut(sessionId);

        res.sendStatus(200);    // 200 OK
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.sendStatus(400);    // 400 Bad Request
        } else if (error instanceof errors.ResourceDoesNotExistError) {
            res.sendStatus(401);    // 401 Unauthorized
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

const sessionController = { postSession, getSession, deleteSession };
export default sessionController;

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import services from "../services/services.js";

// =================================================================================================
// Public API
// =================================================================================================
async function logIn(req, res) {
    const { userId, password } = req.body;

    try {
        const responseBody = await services.logIn(userId, password);
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

async function authenticateSession(req, res) {
    const { sessionId } = req.body;

    try {
        const responseBody = await services.authenticateSession(sessionId);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(200);    // 200 OK
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.send(400);  // 400 Bad Request
        } else if (error instanceof errors.ResourceDoesNotExistError) {
            res.send(401);  // 401 Unauthorized
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

const authenticationController = { logIn, authenticateSession };
export default authenticationController;

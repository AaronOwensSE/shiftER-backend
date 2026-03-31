// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../../errors.js";
import httpTools from "../http-tools.js";
import service from "../../service/service.js";

// =================================================================================================
// Public API
// =================================================================================================
async function postUser(req, res) {
    const user = req.body;

    try {
        const responseBody = await service.createUser(user);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(200);    // 200 OK
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.sendStatus(400);    // 400 Bad Request
        } else if (error instanceof errors.ResourceAlreadyExistsError) {
            res.sendStatus(409);    // 409 Conflict
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

async function getUser(req, res) {
    const sessionId = httpTools.getBearerToken(req);
    const userId = req.params.userId;

    try {
        const responseBody = await service.retrieveUserProfile(sessionId, userId);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(200);
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.sendStatus(400);    // 400 Bad Request
        } else if (error instanceof errors.ResourceDoesNotExistError) {
            res.sendStatus(401);    // 401 Unauthorized
        } else if (error instanceof errors.UnauthorizedAccessError) {
            res.sendStatus(403);    // 403 Forbidden
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

const userController = { postUser, getUser };
export default userController;

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import constants from "../../constants.js";
import httpTools from "../http-tools.js";
import service from "../../service/service.js";
import serviceErrors from "../../service/service-errors.js";

// =================================================================================================
// Public API
// =================================================================================================
async function postSession(req, res) {
    const { userId, password } = req.body;

    try {
        const responseBody = await service.logIn(userId, password);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(constants.HTTP_200_OK);
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof serviceErrors.InvalidInputError) {
            res.sendStatus(constants.HTTP_400_BAD_REQUEST);
        } else if (error instanceof serviceErrors.UnableToAuthenticateError) {
            res.sendStatus(constants.HTTP_401_UNAUTHORIZED);
        } else if (error instanceof serviceErrors.TooManyAttemptsError) {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        } else {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        }
    }
}

async function getSession(req, res) {
    const sessionId = httpTools.getBearerToken(req);

    try {
        const responseBody = await service.resumeSession(sessionId);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(constants.HTTP_200_OK);
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof serviceErrors.InvalidInputError) {
            res.sendStatus(constants.HTTP_400_BAD_REQUEST);
        } else if (error instanceof serviceErrors.UnableToAuthenticateError) {
            res.sendStatus(constants.HTTP_401_UNAUTHORIZED);
        } else {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        }
    }
}

async function deleteSession(req, res) {
    const sessionId = httpTools.getBearerToken(req);

    try {
        await service.logOut(sessionId);

        res.sendStatus(constants.HTTP_200_OK);
    } catch (error) {
        if (error instanceof serviceErrors.InvalidInputError) {
            res.sendStatus(constants.HTTP_400_BAD_REQUEST);
        } else if (error instanceof serviceErrors.UnableToAuthenticateError) {
            res.sendStatus(constants.HTTP_401_UNAUTHORIZED);
        } else {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        }
    }
}

const sessionController = { postSession, getSession, deleteSession };
export default sessionController;

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
async function postUser(req, res) {
    const user = req.body;

    try {
        await service.createUser(user);

        res.sendStatus(constants.HTTP_200_OK);
    } catch (error) {
        if (error instanceof serviceErrors.InvalidInputError) {
            res.sendStatus(constants.HTTP_400_BAD_REQUEST);
        } else if (error instanceof serviceErrors.ResourceAlreadyExistsError) {
            res.sendStatus(constants.HTTP_409_CONFLICT);
        } else {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        }
    }
}

async function getUser(req, res) {
    const sessionId = httpTools.getBearerToken(req);
    const userId = req.params.userId;

    try {
        const responseBody = await service.retrieveUserProfile(sessionId, userId);
        const responseBodyJson = JSON.stringify(responseBody);

        res.status(constants.HTTP_200_OK);
        res.send(responseBodyJson);
    } catch (error) {
        if (error instanceof serviceErrors.InvalidInputError) {
            res.sendStatus(constants.HTTP_400_BAD_REQUEST);
        } else if (error instanceof serviceErrors.UnableToAuthenticateError) {
            res.sendStatus(constants.HTTP_401_UNAUTHORIZED);
        } else if (error instanceof serviceErrors.UnauthorizedAccessError) {
            res.sendStatus(constants.HTTP_403_FORBIDDEN);
        } else if (error instanceof serviceErrors.ResourceDoesNotExistError) {
            res.sendStatus(constants.HTTP_404_NOT_FOUND);
        } else {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        }
    }
}

async function deleteUser(req, res) {
    const sessionId = httpTools.getBearerToken(req);
    const userId = req.params.userId;

    try {
        await service.deleteUser(sessionId, userId);

        res.sendStatus(constants.HTTP_200_OK);
    } catch (error) {
        if (error instanceof serviceErrors.InvalidInputError) {
            res.sendStatus(constants.HTTP_400_BAD_REQUEST);
        } else if (error instanceof serviceErrors.UnableToAuthenticateError) {
            res.sendStatus(constants.HTTP_401_UNAUTHORIZED);
        } else if (error instanceof serviceErrors.UnauthorizedAccessError) {
            res.sendStatus(constants.HTTP_403_FORBIDDEN);
        } else if (error instanceof serviceErrors.ResourceDoesNotExistError) {
            res.sendStatus(constants.HTTP_404_NOT_FOUND);
        } else {
            res.sendStatus(constants.HTTP_500_INTERNAL_SERVER_ERROR);
        }
    }
}

const userController = { postUser, getUser, deleteUser };
export default userController;

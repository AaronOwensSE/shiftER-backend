// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import services from "../services/services.js";

// =================================================================================================
// Public API
// =================================================================================================
async function logIn(req, res) {
    const { id, password } = req.body;

    try {
        const body = await services.logIn(id, password);
        const jsonBody = JSON.stringify(body);

        res.status(200);
        res.send(jsonBody);
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            res.sendStatus(400);    // 400 Bad Request
        } else if (error instanceof errors.InvalidCredentialsError) {
            res.sendStatus(401);    // 401 Unauthorized
        } else {
            res.sendStatus(500);    // 500 Internal Server Error
        }
    }
}

const authenticationController = { logIn };
export default authenticationController;

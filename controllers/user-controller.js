// =================================================================================================
// Internal Dependencies
// =================================================================================================
import errors from "../errors.js";
import services from "../services/services.js";

// =================================================================================================
// Public API
// =================================================================================================
async function createUser(req, res) {
    const user = req.body;

    try {
        const responseBody = await services.createUser(user);
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

const userController = { createUser };
export default userController;

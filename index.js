// =================================================================================================
// External Dependencies
// =================================================================================================
import "dotenv/config";
import express from "express";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userController from "./controllers/user-controller.js";
import authenticationController from "./controllers/authentication-controller.js";

// =================================================================================================
// Commands
// =================================================================================================
const app = express();
app.use(express.json());    // Required to access req.body.

app.post("/create-user", userController.createUser);
app.post("/log-in", authenticationController.logIn);

const server = app.listen(process.env.PORT);  // App blocks here.

/*
Need to create a brief shutdown procedure that handles server.close() and pool.end() in that order.
But pool is at the database layer and should not be called directly. Shutdown endpoints are needed
for database and service layers.

process.on("SIGINT", shutdown);     // Ctrl+C
process.on("SIGTERM", shutdown);    // Shutdown signal (such as from Render)
*/

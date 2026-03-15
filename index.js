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

// Post user -> Create user
app.post("/users", userController.postUser);

// Post session -> Log in
app.post("/sessions", authenticationController.postSession);

// Get session (current) -> Authenticate session
app.get("/sessions/current", authenticationController.getSession);

// Delete session (current) -> Log out
app.delete("/sessions/current", authenticationController.deleteSession);

const server = app.listen(process.env.PORT);  // App blocks here.

/*
Need to create a brief shutdown procedure that handles server.close() and pool.end() in that order.
But pool is at the database layer and should not be called directly. Shutdown endpoints are needed
for database and service layers.

process.on("SIGINT", shutdown);     // Ctrl+C
process.on("SIGTERM", shutdown);    // Shutdown signal (such as from Render)
*/

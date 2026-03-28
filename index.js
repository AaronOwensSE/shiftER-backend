// =================================================================================================
// External Dependencies
// =================================================================================================
import "dotenv/config";
import express from "express";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userController from "./controllers/user-controller.js";
import sessionController from "./controllers/session-controller.js";

// =================================================================================================
// Commands
// =================================================================================================
const app = express();
app.use(express.json());    // Required to access req.body.

// Post user -> Create user
app.post("/users", userController.postUser);

// Post session -> Log in
app.post("/sessions", sessionController.postSession);

// Get session (current) -> Authenticate session
app.get("/sessions/current", sessionController.getSession);

// Delete session (current) -> Log out
app.delete("/sessions/current", sessionController.deleteSession);

const server = app.listen(process.env.PORT);  // App blocks here.

/*
Need to create a brief shutdown procedure that handles server.close() and pool.end() in that order.
But direct calls to pool, at least, are not appropriate (and server may need to be broken out to a
different layer). Existing layers need endpoints to forward these requests.

process.on("SIGINT", shutdown);     // Ctrl+C
process.on("SIGTERM", shutdown);    // Shutdown signal (such as from Render)
*/

// =================================================================================================
// External Dependencies
// =================================================================================================
import "dotenv/config"; // Can this be separated to a setup file?
import express from "express";

// =================================================================================================
// Internal Dependencies
// =================================================================================================
import userController from "./controllers/user-controller.js";

// =================================================================================================
// Commands
// =================================================================================================
const app = express();
app.use(express.json());    // Required to access req.body.

app.post("/create-user", userController.createUser);

app.listen(process.env.PORT);  // App blocks here.

// This will never get called. We need to hook into shutdown signals for cleanup functions.
// After redesign, this also shouldn't appear in this layer. Service layer needs to expose a
// shutdown function which in turn can call on database layer to shut down.
//pool.end();

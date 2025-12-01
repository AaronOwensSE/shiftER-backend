"use strict";

// External Dependencies
import "dotenv/config";
import express from "express";

// Internal Modules
import pool from "./db/pool.js";
import userController from "./controllers/user-controller.js";
import authenticationController from "./controllers/authentication-controller.js";

const app = express();

app.use(express.json());    // Required to access req.body.

app.post("/create-user", async (req, res) => {
    const user = req.body;
    const result = await userController.createUser(user);
    const resultJson = JSON.stringify(result);

    res.send(resultJson);
});

app.post("/log-in", async (req, res) => {
    const { id, password } = req.body;
    const result = await authenticationController.logIn(id, password);
    const resultJson = JSON.stringify(result);

    res.send(resultJson);
});

app.post("/authenticate-session", async (req, res) => {
    const id = req.body;
    const result = await authenticationController.authenticateSession(id);
    const resultJson = JSON.stringify(result);

    res.send(resultJson);
});

app.listen(process.env.HTTP_PORT);  // App blocks here.

// This will never get called. We need to hook into shutdown signals for cleanup functions.
//pool.end();

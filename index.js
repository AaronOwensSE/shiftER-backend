"use strict";

// External Dependencies
import "dotenv/config";
import express from "express";

// Internal Modules
import pool from "./db/pool.js";
import userRouter from "./routes/user-route.js";

// Execution
const app = express();
app.use(express.json());    // "Middleware to parse body"
app.use("/user", userRouter);
app.listen(process.env.HTTP_PORT);  // App will block here, and that's what's supposed to happen.

// This will never get called. We need to hook into shutdown signals for cleanup functions.
//pool.end();

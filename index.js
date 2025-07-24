"use strict";

// External Dependencies
import "dotenv/config";
import "express";

// Internal Modules
import pool from "./db/pool.js";
import userRouter from "./routes/user-route.js";

// Execution
const app = express();
app.use("/user", userRouter);
pool.end();

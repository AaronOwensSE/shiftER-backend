"use strict";

// External Dependencies
import Router from "express";
import userController from "../controllers/user-controller.js";

// Exports
const userRouter = Router();
userRouter.post("/",
    (req, res) => {
        console.log(req.body);
        const { id, password, name, email } = req.body;
        userController.createUser(id, password, name, email);
    }
);

export default userRouter;

import express from "express";
import * as authControllers from "../controllers/authControllers.js";


const authRouter = express.Router();

authRouter.get("/login", authControllers.login_get);
authRouter.post("/login", authControllers.login_post);

export default authRouter; 
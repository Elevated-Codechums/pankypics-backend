import express from "express";
import * as authControllers from "../controllers/authControllers.js";


const authRouter = express.Router();

authRouter.get("/login", authControllers.login_get);
authRouter.post("/login", authControllers.login_post);
authRouter.get("/signup", authControllers.signup_get);
authRouter.post("/signup", authControllers.signup_post);


export default authRouter; 
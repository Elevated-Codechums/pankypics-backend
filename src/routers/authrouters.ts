import express from "express";
import * as authcontrollers from "../controllers/authcontrollers.js";


const authRouter = express.Router();

authRouter.get("/login", authcontrollers.login_get);
authRouter.post("/login", authcontrollers.login_post);
authRouter.get("/signup", authcontrollers.signup_get);
authRouter.post("/signup", authcontrollers.signup_post);

export default authRouter; 
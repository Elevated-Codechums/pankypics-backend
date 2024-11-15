import express from "express";
import { login_post, signup_post } from "../controllers/authControllers.js";


const authRouter = express.Router();

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);


export default authRouter; 
import express from "express";
import * as getUploadsControllers from "../controllers/getUploadsControllers.js";

const getUploadsRouter = express.Router();

getUploadsRouter.get("/uploads", getUploadsControllers.getUploads_get);

export default getUploadsRouter;
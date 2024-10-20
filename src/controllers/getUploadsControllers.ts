import dotenv from "dotenv";
import {Request, Response, NextFunction} from "express";

dotenv.config();

export const getUploads_get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json("getUploads_get");
    } catch (error) {
        console.log(error);
    }
};
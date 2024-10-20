import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import poolDB from "../config/database.js";
import { Request, Response, NextFunction } from "express";
dotenv.config();


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err: any , decodedToken: jwt.JwtPayload | string | undefined) => {
            if (err) {
                console.log(err.message);
                res.redirect('/admin/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/admin/login');
    }
}
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err: any, decodedToken: any) => {
            if (err) {
                console.log(err.message);
                res.locals.admin = null;
                next();
            } else {
                console.log(decodedToken);
                (async () => {
                    let admin = await poolDB.query("SELECT admin_name, admin_email, password FROM admin where admin_id = $1", [decodedToken]);
                    res.locals.admin = admin.rows[0];
                    next();
                })();
            }
        });
    } else {
        res.locals.admin = null;
        next();
    }};
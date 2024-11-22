import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import poolDB from '../config/database.js';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

interface AdminTokenPayload {
    admin_id: string;
    iat?: number; // Issued at timestamp
    exp?: number; // Expiry timestamp
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err: any, decodedToken: jwt.JwtPayload | string | undefined) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as AdminTokenPayload;
            const admin_id = decodedToken.admin_id;

            if (!admin_id) {
                console.log('admin_id not found in token');
                res.locals.admin = null;
                return next();
            }

            const result = await poolDB.query('SELECT admin_name, admin_email, password FROM admin WHERE admin_id = $1', [admin_id]);

            res.locals.admin = result.rows[0] || null;
        } catch (err) {
            console.error(err);
            res.locals.admin = null;
        }
    } else {
        res.locals.admin = null;
    }
    next();
};

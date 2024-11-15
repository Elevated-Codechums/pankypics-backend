import { createToken, maxAge } from '../helpers/jwtHelper.js';
import dotenv from 'dotenv';
import poolDB from '../config/database.js';
import { hashPassword, comparePassword } from '../helpers/passHelper.js';
import { Request, Response, NextFunction } from 'express';

dotenv.config();


export const signup_post = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, key } = req.body;
    try {
        if (key !== process.env.ADMIN_KEY) {
            res.status(400).json({ error: 'Invalid key' });
        }
        const bcrpytpassword = await hashPassword(password);
        const result = await poolDB.query('INSERT INTO admin (admin_name, admin_email, password) VALUES ($1, $2, $3) RETURNING *', [
            name,
            email,
            bcrpytpassword
        ]);
        const token = createToken(result.rows[0].id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json(`signup Successful jwt token: ${token}`);
        next();
    } catch (err) {
        res.status(400).json({ err });
        next();
    }
};

export const login_post = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const result = await poolDB.query('SELECT admin_email, password FROM admin where admin_email = $1', [email]);
        if (result.rows.length === 0) {
            res.status(400).json({ error: 'Invalid credentials' });
        }
        const admin_email = result.rows[0].admin_email;
        const admin_password = result.rows[0].password;
        if (email === admin_email) {
            const auth = await comparePassword(password, admin_password);
            if (auth === false) {
                res.status(400).json({ error: 'Invalid password' });
                next();
            } else {
                const token = createToken(result.rows[0].id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(200).json(`login Successful jwt token: ${token}`);
            }
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
        next();
    } catch (err) {
        res.status(400).json({ err });
        next();
    }
};

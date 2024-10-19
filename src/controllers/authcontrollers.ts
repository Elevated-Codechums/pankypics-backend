import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import poolDB from '../config/database.js';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const handleErrors = (err: any) => {
    console.log(err.message);
    let errors = { name: '' ,email: '', password: '' };
if (err.name === 'incorrect email'){
    errors.name = 'That name is not registered';
}
if (err.message === 'incorrect email') {
    errors.email = 'That email is not of admin';
};
if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
};
    return errors;
};
const maxAge = 7 * 24 * 60 * 60;
const createToken = (id: string) => {
  return jwt.sign({ id
    }, `${process.env.JWT_SECRET}`, {
        expiresIn: maxAge
    });
};

export const login_get = (req: any, res: any) => {
    res.send('login page');
};

export const login_post = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
        const result = await poolDB.query("SELECT admin_name, admin_email, password FROM admin where admin_email = $1", [email]);
        const admin_name = result.rows[0].admin_name;
        const admin_email = result.rows[0].admin_email;
        const admin_password = result.rows[0].password;
        if (email === admin_email && password === admin_password && name === admin_name) {
            const token = createToken(result.rows[0].id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 * 2 });
            res.status(200).json(`login Successful jwt token: ${token}`);
        } else {
            res.status(400).json({ error: 'Incorrect email' });
        }
        next();
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        next();
    }
};



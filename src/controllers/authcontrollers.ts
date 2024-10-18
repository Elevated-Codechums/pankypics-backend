import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import poolDB from '../config/database.js';

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

export const login_post = async (req: any, res: any) => {
    const { name, email, password } = req.body;
    try {
        res.send('login post');
        // const admin = await poolDB.query("SELECT * FROM admin WHERE email = $1", [email]);
        // if (admin.rows.length > 0) {
        //     const token = createToken(admin.rows[0].id);
        //     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        //     res.status(200).json({ admin: admin.rows[0].id });
        // } else {
        //     res.status(400).json({ error: 'Incorrect email or password' });
        // }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};



const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
import poolDB from "../config/database.js";
dotenv.config();

const requireAuth = (req: any, res: any, next: any) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err: any , decodedToken: object | undefined) => {
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
const checkAdmin = (req: any, res: any, next: any) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, `${process.env.JWT_SECRET}`, async (err: any, decodedToken: object | undefined) => {
            if (err) {
                console.log(err.message);
                res.locals.admin = null;
                next();
            } else {
                console.log(decodedToken);
                let admin = await poolDB.query("SELECT admin_name, admin_email, password FROM admin where admin_id = $1", [decodedToken]);
                res.locals.admin = admin.rows[0];
                next();
            }
        });
    } else {
        res.locals.admin = null;
        next();
    }};
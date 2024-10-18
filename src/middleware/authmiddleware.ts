const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
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
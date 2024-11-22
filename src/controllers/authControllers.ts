import { createToken, maxAge } from '../helpers/jwtHelper.js';
import dotenv from 'dotenv';
import poolDB from '../config/database.js';
import { hashPassword, comparePassword } from '../helpers/passHelper.js';
import { Request, Response } from 'express';

dotenv.config();

export const signup_post = async (req: Request, res: Response) => {
    const { name, email, password, key } = req.body;
    try {
        // Check for valid admin key
        if (key !== process.env.ADMIN_KEY) {
            return res.status(400).json({ error: 'Invalid key' });
        }

        // Hash the password before storing
        const hashedPassword = await hashPassword(password);

        // Insert new admin into the database
        const result = await poolDB.query('INSERT INTO admin (admin_name, admin_email, password) VALUES ($1, $2, $3) RETURNING *', [
            name,
            email,
            hashedPassword
        ]);

        // Generate a JWT token for the newly created admin
        const token = createToken(result.rows[0].admin_id);

        // Send token as a cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        // Return a success message with the JWT token
        return res.status(201).json({ message: 'Signup successful', jwt: token });
    } catch (err) {
        // Handle different error scenarios
        if (err instanceof Error) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(400).json({ error: 'An unexpected error occurred' });
    }
};

export const login_post = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Check if the admin email exists in the database
        const result = await poolDB.query('SELECT admin_id, admin_email, password FROM admin WHERE admin_email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Extract password from database
        const admin_password = result.rows[0].password;

        // Compare provided password with stored password
        const auth = await comparePassword(password, admin_password);
        if (!auth) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate a JWT token for the logged-in admin
        const token = createToken(result.rows[0].admin_id);

        // Send token as a cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        // Return success message with the JWT token
        console.log('Login successful');
        return res.status(200).json({ message: 'Login successful', jwt: token });
    } catch (err) {
        // Handle different error scenarios
        if (err instanceof Error) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(400).json({ error: 'An unexpected error occurred' });
    }
};

export const logout = async (req: Request, res: Response) => {
    // Clear the JWT cookie to log the user out
    res.cookie('jwt', '', { maxAge: 1 });

    // Redirect to the homepage or login page
    res.redirect('/');
};

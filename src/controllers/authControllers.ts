import { Request, Response } from 'express';
import poolDB from '../config/database.js';
import { hashPassword, verifyPassword } from '../helpers/passHelper.js';
import { generateToken, verifyToken } from '../helpers/jwtHelper.js';
import dotenv from 'dotenv';
dotenv.config();

interface Admin {
    admin_name: string;
    admin_email: string;
    password: string;
    key: string;
    unique_id: number;
}

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { admin_name, admin_email, password, key }: Admin = req.body;

        if (key !== process.env.ADMIN_KEY) {
            res.status(401).json({ error: 'Invalid key' });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const unique_id = Date.now(); // Simple unique ID generator
        const query = 'INSERT INTO admin (admin_name, admin_email, password, unique_id) VALUES ($1, $2, $3, $4) RETURNING admin_id';
        const values = [admin_name, admin_email, hashedPassword, unique_id];

        const result = await poolDB.query(query, values);
        res.status(201).json({
            success: 'Admin registered successfully',
            admin: {
                name: admin_name,
                email: admin_email,
                password: hashedPassword
            }
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { admin_email, password } = req.body;
        const query = 'SELECT * FROM admin WHERE admin_email = $1';
        const values = [admin_email];

        const result = await poolDB.query(query, values);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Admin not found' });
            return;
        }

        const admin = result.rows[0];
        const isPasswordValid = await verifyPassword(password, admin.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken({ admin_id: admin.admin_id, unique_id: admin.unique_id });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({
            success: 'Login successful',
            admin: {
                name: admin.admin_name,
                email: admin.admin_email
            }
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const checkAuthentication = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if the token is in cookies
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded || !decoded.admin_id) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }

        // Fetch admin details from the database
        const query = 'SELECT admin_name, admin_email FROM admin WHERE admin_id = $1';
        const values = [decoded.admin_id];
        const result = await poolDB.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Admin not found' });
            return;
        }

        const admin = result.rows[0];

        // Return admin details
        res.status(200).json({
            success: 'You are authenticated',
            admin: {
                name: admin.admin_name,
                email: admin.admin_email
            }
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const logoutAdmin = (req: Request, res: Response) => {
    res.clearCookie('token');
    console.log('Logout successful');
    res.status(200).json({ message: 'Logout successful' });
};

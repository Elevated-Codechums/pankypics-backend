import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const maxAge = process.env.JWT_MAX_AGE ? parseInt(process.env.JWT_MAX_AGE) : 7 * 24 * 60 * 60;

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: maxAge });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null; // Explicitly return null for better error handling
    }
};

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const maxAge = process.env.JWT_MAX_AGE ? parseInt(process.env.JWT_MAX_AGE) : 7 * 24 * 60 * 60; // Default: 7 days

interface AdminTokenPayload {
    admin_id: string;
    iat?: number;
    exp?: number;
}

export const createToken = (admin_id: string): string => {
    return jwt.sign({ admin_id }, process.env.JWT_SECRET!, { expiresIn: maxAge });
};

export const verifyToken = (token: string): AdminTokenPayload | string | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as AdminTokenPayload | string;
    } catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};

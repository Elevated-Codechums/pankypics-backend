import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwtHelper.js';
import poolDB from '../config/database.js';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return; // Ensure no further execution
    }

    try {
        const decoded = verifyToken(token);
        req.body.admin = decoded; // Attach admin data to the request
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const checkAuthentication = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

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

        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

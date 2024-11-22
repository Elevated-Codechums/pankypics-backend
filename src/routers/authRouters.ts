import express from 'express';
import { login_post, logout, signup_post } from '../controllers/authControllers.js';
import { requireAuth, checkAdmin } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await login_post(req, res);
});

authRouter.post('/register', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await signup_post(req, res);
});

authRouter.get('/dashboard');

authRouter.get('/dashboard', requireAuth, (req: express.Request, res: express.Response) => {
    res.json({ message: 'Welcome to the admin dashboard' });
});

authRouter.get('/profile', checkAdmin, (req: express.Request, res: express.Response) => {
    const admin = res.locals.admin;
    res.json({ admin });
});

authRouter.get('/logout', logout);

export default authRouter;

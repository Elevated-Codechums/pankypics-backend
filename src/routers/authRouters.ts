import { Router } from 'express';
import { registerAdmin, loginAdmin, logoutAdmin, checkAuthentication } from '../controllers/authControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

router.get('/check-auth', checkAuthentication);

router.get('/admin', authenticate, (req, res) => {
    res.status(200).json({ message: `You are authenticated!` });
});

export default router;

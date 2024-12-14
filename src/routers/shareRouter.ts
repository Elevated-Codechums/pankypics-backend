import { Router, Request, Response } from 'express';
import { getSharedItem } from '../controllers/shareController.js';

const shareRouter = Router();

// Route to fetch shared album or photo
shareRouter.get('/:shareToken', getSharedItem);

export default shareRouter;

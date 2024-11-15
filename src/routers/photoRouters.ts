import express from 'express';
import { getPhoto } from '../controllers/photoController.js';

const photoRouter = express.Router();

photoRouter.get('/:photo_id', getPhoto);

export default photoRouter;
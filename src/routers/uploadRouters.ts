import express from 'express';
import * as uploadControllers from '../controllers/uploadControllers.js';

const uploadRouter = express.Router();

uploadRouter.post('/new/upload', uploadControllers.upload_post);

export default uploadRouter;

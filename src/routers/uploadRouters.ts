import express from 'express';

import {uploadGet, uploadPost} from '../controllers/uploadControllers.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload/photo', uploadPost);
uploadRouter.get('/upload/get_photo', uploadGet);

export default uploadRouter;
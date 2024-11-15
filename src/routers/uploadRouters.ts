import express from 'express';

import { uploadPhotoWithAlbum, uploadPhotoWithoutAlbum } from '../controllers/uploadControllers.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload/photo', uploadPhotoWithoutAlbum);
uploadRouter.post('/album/upload/photos', uploadPhotoWithAlbum);

export default uploadRouter;

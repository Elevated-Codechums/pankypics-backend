import express from 'express';
import { getAlbumPhotos, getAlbum, getAlbums } from '../controllers/albumsController.js';
import photoRouter from './photoRouters.js';

const albumsRouter = express.Router();

albumsRouter.get('/albums', getAlbums);

albumsRouter.get('/album/:album_id', getAlbum);

albumsRouter.get('/album/:album_id/photos', getAlbumPhotos);

albumsRouter.use('/album/:album_id/photo', photoRouter);


export default albumsRouter;
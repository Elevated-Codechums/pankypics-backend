import { Request, Response, NextFunction } from 'express';
import { uploadPhotosToGCS_WithAlbum, uploadPhotosToGCS_WithoutAlbum } from '../helpers/uploadHelpers.js';
import { multerGoogleCloadStorage } from '../config/storage.js';
import poolDB from '../config/database.js';
import crypto from 'crypto';

export async function uploadPhotoWithAlbum(req: Request, res: Response, next: NextFunction) {
    const upload = multerGoogleCloadStorage.array('photos');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).send({ error: 'Error uploading file' });
        }

        const albumId = parseInt(crypto.randomBytes(4).toString('hex'), 16);
        const albumName = req.body.albumName;
        const albumDescription = req.body.albumDescription;
        const files = req.files as Express.Multer.File[];
        const photoCaptions = req.body.photoCaptions; // Assuming photoCaptions is an array of captions

        if (!files || files.length === 0) {
            return res.status(400).send({ error: 'At least one photo file is required' });
        }

        if (!photoCaptions || photoCaptions.length !== files.length) {
            return res.status(400).send({ error: 'Photo captions are required for each photo' });
        }

        try {
            const publicURLs = await uploadPhotosToGCS_WithAlbum(albumId, files, albumName);

            await poolDB.query('INSERT INTO album (album_id, album_name, album_description) VALUES ($1, $2, $3)', [
                albumId,
                albumName,
                albumDescription
            ]);

            for (let [index, file] of files.entries()) {
                const photoId = parseInt(crypto.randomBytes(4).toString('hex'), 16);
                const photoURL = publicURLs[index];
                const photoCaption = photoCaptions[index];

                await poolDB.query('INSERT INTO photos (photo_id, photo_url, album_id, photo_caption) VALUES ($1, $2, $3, $4)', [
                    photoId,
                    photoURL,
                    albumId,
                    photoCaption
                ]);
            }

            res.status(200).send({
                message: 'Files uploaded successfully!',
                publicURLs
            });
        } catch (error) {
            console.error('Caught Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).send({ error: errorMessage });
            next(error);
        }
    });
}

export async function uploadPhotoWithoutAlbum(req: Request, res: Response, next: NextFunction) {
    // Initialize multer to handle file upload
    const upload = multerGoogleCloadStorage.single('photo');

    // Call multer to handle the file
    upload(req, res, async (err) => {
        const photoId = parseInt(crypto.randomBytes(4).toString('hex'), 16);
        const file = req.file;
        const photoCaption = req.body.photoCaption;

        try {
            if (err) {
                console.error('Multer Error:', err);
                throw new Error('Error uploading file');
            }

            // Check if file is present
            if (!req.file) {
                console.error('No file found in request');
                throw new Error('Photo file is required');
            }

            // Proceed with upload to Google Cloud Storage
            const publicURL = await uploadPhotosToGCS_WithoutAlbum(photoId, file);

            await poolDB.query('INSERT INTO photos (photo_id, photo_url, photo_caption) VALUES ($1, $2, $3)', [photoId, publicURL, photoCaption]);

            res.status(200).send({
                message: 'File uploaded successfully!',
                caption: photoCaption,
                url: publicURL
            });
        } catch (error) {
            console.error('Caught Error:', error); // Log detailed error
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).send({ error: errorMessage });
            next(error);
        }
    });
}

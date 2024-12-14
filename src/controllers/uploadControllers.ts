import { Request, Response, NextFunction } from 'express';
import { uploadPhotosToGCS_WithAlbum, uploadPhotosToGCS_WithoutAlbum } from '../helpers/uploadHelpers.js';
import { multerGoogleCloadStorage } from '../config/storage.js';
import poolDB from '../config/database.js';
import crypto from 'crypto';

// Helper to generate UUID
const generateUUID = (): string => crypto.randomUUID();
const generateBigIntId = (): bigint => BigInt(`0x${crypto.randomBytes(7).toString('hex')}`);

// Upload photos with an album
export async function uploadPhotoWithAlbum(req: Request, res: Response, next: NextFunction) {
    const upload = multerGoogleCloadStorage.array('photos');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).send({ error: 'Error uploading files' });
        }

        const albumId = generateBigIntId(); // Generate BigInt ID for album
        const albumName = req.body.albumName || 'Untitled Album';
        const albumDescription = req.body.albumDescription || '';
        const isPublic = req.body.isPublic === 'true'; // Public/Private toggle
        const files = req.files as Express.Multer.File[];
        const photoCaptions = req.body.photoCaptions || []; // Assume captions are an array
        const shareToken = generateUUID(); // Generate UUID for the share token

        if (!files || files.length === 0) {
            return res.status(400).send({ error: 'At least one photo file is required' });
        }

        if (!photoCaptions || photoCaptions.length !== files.length) {
            return res.status(400).send({ error: 'Provide captions for all photos' });
        }

        try {
            // Upload photos to GCS
            const publicURLs = await uploadPhotosToGCS_WithAlbum(Number(albumId), files, albumName);

            // Insert album into DB
            await poolDB.query('INSERT INTO album (album_id, album_name, album_description, is_public, share_token) VALUES ($1, $2, $3, $4, $5)', [
                albumId,
                albumName,
                albumDescription,
                isPublic,
                shareToken
            ]);

            // Insert photos into DB
            for (let index = 0; index < files.length; index++) {
                const photoId = generateBigIntId();
                const photoURL = publicURLs[index];
                const photoCaption = photoCaptions[index];

                await poolDB.query('INSERT INTO photos (photo_id, photo_url, album_id, photo_caption, is_public) VALUES ($1, $2, $3, $4, $5)', [
                    photoId,
                    photoURL,
                    albumId,
                    photoCaption,
                    isPublic
                ]);
            }

            res.status(200).send({
                message: 'Photos uploaded successfully!',
                publicURLs,
                shareToken // Include shareToken in the response
            });
        } catch (error) {
            console.error('Upload Error:', error);
            next(error);
        }
    });
}

// Upload a single photo without an album
export async function uploadPhotoWithoutAlbum(req: Request, res: Response, next: NextFunction) {
    const upload = multerGoogleCloadStorage.single('photo');

    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).send({ error: 'Error uploading file' });
        }
        const photoId = generateBigIntId(); // Generate BigInt ID for photo
        const file = req.file;
        const photoCaption = req.body.photoCaption || '';
        const isPublic = req.body.isPublic === 'true'; // Public/Private toggle
        const shareToken = generateUUID(); // Generate a UUID for individual photo sharing

        if (!file) {
            return res.status(400).send({ error: 'Photo file is required' });
        }

        try {
            // Upload photo to GCS
            const publicURL = await uploadPhotosToGCS_WithoutAlbum(Number(photoId), file);

            // Insert photo into DB
            await poolDB.query('INSERT INTO photos (photo_id, photo_url, photo_caption, is_public, share_token) VALUES ($1, $2, $3, $4, $5)', [
                photoId,
                publicURL,
                photoCaption,
                isPublic,
                shareToken
            ]);

            res.status(200).send({
                message: 'Photo uploaded successfully!',
                caption: photoCaption,
                url: publicURL,
                shareToken // Include the shareToken for sharing this photo
            });
        } catch (error) {
            console.error('Upload Error:', error);
            next(error);
        }
    });
}

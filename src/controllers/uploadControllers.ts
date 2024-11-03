import { Request, Response, NextFunction } from 'express';
import { uploadToGCS } from '../helpers/uploadHelpers.js';
import { multerGoogleCloadStorage } from '../config/storage.js';

export async function uploadPost(req: Request, res: Response, next: NextFunction) {
    // Initialize multer to handle file upload
    const upload = multerGoogleCloadStorage.single('photo');

    // Call multer to handle the file
    upload(req, res, async (err) => {

        const albumName = req.body.albumName || "default-album";
        const file = req.file;

        try {
            if (err) {
                console.error("Multer Error:", err);
                throw new Error('Error uploading file');
            }

            // Check if file is present
            if (!req.file) {
                console.error("No file found in request");
                throw new Error('Photo file is required');
            }

            // Proceed with upload to Google Cloud Storage
            const publicURL = await uploadToGCS(file, albumName);
            res.status(200).send({
                message: 'File uploaded successfully',
                url: publicURL
            });
        } catch (error) {
            console.error("Caught Error:", error); // Log detailed error
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).send({ error: errorMessage });
            next(error);
        }
    });
}


export const uploadGet = (req: Request, res: Response) => {
    res.send('get photo');
};

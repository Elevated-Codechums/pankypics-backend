import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

dotenv.config();

export const upload_post = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const storage = new Storage({
            keyFilename: process.env.GOOGLE_CLOUD_KEYFILENAME
        });

        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const keyFilename = process.env.GOOGLE_CLOUD_KEYFILENAME;
        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

        if (!bucketName) {
            return res.status(400).send('Bucket name is not defined.');
        }
        const bucket = storage.bucket(bucketName);

        const upload = multer({
            storage: multer.memoryStorage()
        });

        upload.single('file')(req, res, (err: any) => {
            if (err) {
                return res.status(400).send('Something went wrong!');
            }
        });

        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileName = file.originalname + '_' + Date.now();


        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype 
            }
        });

        blobStream.on('error', (err: any) => {
            console.log(err);
        });

        blobStream.on('finish', () => {
            res.redirect('/');
        });

    } catch (error) {
        console.log(error);
    }
};

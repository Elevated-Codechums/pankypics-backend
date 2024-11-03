import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const storage = new Storage({
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILENAME,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

if (!bucketName) {
    throw new Error("Google Cloud bucket name is not defined in environment variables");
}

export const bucket = storage.bucket(bucketName);

export const multerGoogleCloadStorage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

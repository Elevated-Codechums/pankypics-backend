import { bucket } from '../config/storage.js';


const defaultAlbum = 'misc-album';

export const uploadPhotosToGCS_WithAlbum = (albumId: number, files: any, album: string) => {
    return Promise.all(
        files.map((file: any) => {
            return new Promise((resolve, reject) => {
                
                const albumName = typeof album === 'string' && album.trim() ? album : defaultAlbum;

                const blob = bucket.file(`${albumName}/${file.originalname}`);

                const blobStream = blob.createWriteStream({
                    resumable: false,
                    contentType: file.mimetype
                });

                blobStream.on('error', (error) => {
                    reject(error);
                });

                blobStream.on('finish', () => {
                    const publicURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve(publicURL);
                });

                blobStream.end(file.buffer);
            });
        })
    );
};

export const uploadPhotosToGCS_WithoutAlbum = (photoId: number, file: any) => {
    return new Promise((resolve, reject) => {


        const blob = bucket.file(`${defaultAlbum}/${photoId}-${file.originalname}`);

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype
        });

        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', () => {
            const publicURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicURL);
        });

        blobStream.end(file.buffer);
    });
};
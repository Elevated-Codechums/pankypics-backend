import { Request, Response } from 'express';
import poolDB from '../config/database.js';

// Get shared album or photo by shareToken
export const getSharedItem = async (req: Request, res: Response): Promise<void> => {
    const { shareToken } = req.params;

    try {
        // First, check if the shareToken matches an album
        const albumResult = await poolDB.query('SELECT album_id, album_name, album_description, is_public FROM album WHERE share_token = $1', [
            shareToken
        ]);

        if (albumResult.rows.length > 0) {
            const album = albumResult.rows[0];

            // Fetch all photos in the album
            const photosResult = await poolDB.query('SELECT photo_id, photo_url, photo_caption FROM photos WHERE album_id = $1', [album.album_id]);

            res.status(200).json({
                type: 'album',
                album,
                photos: photosResult.rows
            });
            return;
        }

        // If no album, check if the shareToken matches an individual photo
        const photoResult = await poolDB.query('SELECT photo_id, photo_url, photo_caption, is_public FROM photos WHERE share_token = $1', [
            shareToken
        ]);

        if (photoResult.rows.length > 0) {
            const photo = photoResult.rows[0];
            if (!photo.is_public) {
                res.status(403).json({ error: 'This photo is private.' });
                return;
            }

            res.status(200).json({
                type: 'photo',
                photo
            });
            return;
        }

        // If no matches are found
        res.status(404).json({ error: 'Share token not found.' });
    } catch (error) {
        console.error('Error fetching shared item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

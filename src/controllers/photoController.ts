import { Request, Response } from 'express';
import poolDB from '../config/database.js';

export async function getPhoto(req: Request, res: Response): Promise<void> {
    const photoId = req.params.photo_id;

    try {
        const result = await poolDB.query('SELECT photo_id, photo_url, photo_caption FROM photos WHERE photo_id = $1', [photoId]);

        if (result.rows.length === 0) {
            res.status(404).send({ error: 'Photo not found' });
            return;
        }

        const photo = result.rows[0];
        res.status(200).send({
            message: 'Photo found!',
            photo
        });
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

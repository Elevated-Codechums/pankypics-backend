import { Request, Response, NextFunction } from 'express';
import poolDB from '../config/database.js';

export async function getAlbums(req: Request, res: Response): Promise<void> {
    try {
        const result = await poolDB.query('SELECT * FROM album');

        if (result.rows.length === 0) {
            res.status(404).send({ error: 'No albums found' });
            return;
        }

        const albums = result.rows;
        res.status(200).send({
            message: 'Albums found!',
            albums
        });
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getAlbum(req: Request, res: Response): Promise<void> {
    const albumId = req.params.album_id;

    try {
        const result = await poolDB.query('SELECT * FROM album WHERE album_id = $1', [albumId]);

        if (result.rows.length === 0) {
            res.status(404).send({ error: 'Album not found' });
            return;
        }

        const album = result.rows[0];
        res.status(200).send({
            message: 'Album found!',
            album
        });
    } catch (error) {
        console.error('Error fetching album:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getAlbumPhotos(req: Request, res: Response): Promise<void> {
    const albumId = req.params.album_id;

    try {
        const result = await poolDB.query('SELECT * FROM photos WHERE album_id = $1', [albumId]);

        if (result.rows.length === 0) {
            res.status(404).send({ error: 'No photos found for this album' });
            return;
        }

        const photos = result.rows;
        res.status(200).send({
            message: 'Photos found!',
            photos
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

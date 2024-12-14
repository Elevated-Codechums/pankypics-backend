import { Request, Response } from 'express';
import poolDB from '../config/database.js';

// Create a slice
export const createSlice = async (req: Request, res: Response) => {
    const { name, heading, description, images, meta_title, meta_description } = req.body;
    try {
        const result = await poolDB.query(
            `INSERT INTO slices (name, heading, description, images, meta_title, meta_description, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
            [name, heading, description, images, meta_title, meta_description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// Get all slices
export const getAllSlices = async (_req: Request, res: Response) => {
    try {
        const result = await poolDB.query(`SELECT * FROM slices ORDER BY created_at DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// Update a slice
export const updateSlice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, heading, description, images, meta_title, meta_description } = req.body;
    try {
        const result = await poolDB.query(
            `UPDATE slices SET name = $1, heading = $2, description = $3, images = $4, meta_title = $5, meta_description = $6, updated_at = NOW() WHERE id = $7 RETURNING *`,
            [name, heading, description, images, meta_title, meta_description, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

// Delete a slice
export const deleteSlice = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await poolDB.query(`DELETE FROM slices WHERE id = $1`, [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

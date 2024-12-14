import { Request, Response } from 'express';
import poolDB from '../config/database.js'; // Using .js for the import path

// Create a page
export const createPage = async (req: Request, res: Response) => {
    const { slug, title, slices } = req.body;
    try {
        const result = await poolDB.query(
            `INSERT INTO pages (slug, title, slices, created_at, updated_at)
             VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
            [slug, title, JSON.stringify(slices)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        const error = err as Error; // Explicitly casting to Error
        res.status(500).json({ error: error.message });
    }
};

// Get page by slug
export const getPageBySlug = async (
    req: Request<{ slug: string }>, // Explicitly typing req.params
    res: Response
): Promise<void> => {
    const { slug } = req.params;
    try {
        const result = await poolDB.query(`SELECT * FROM pages WHERE slug = $1`, [slug]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Update a page
export const updatePage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { slug, title, slices } = req.body;
    try {
        const result = await poolDB.query(`UPDATE pages SET slug = $1, title = $2, slices = $3, updated_at = NOW() WHERE id = $4 RETURNING *`, [
            slug,
            title,
            JSON.stringify(slices),
            id
        ]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        const error = err as Error; // Explicitly casting to Error
        res.status(500).json({ error: error.message });
    }
};

// Delete a page
export const deletePage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await poolDB.query(`DELETE FROM pages WHERE id = $1`, [id]);
        res.status(204).send();
    } catch (err) {
        const error = err as Error; // Explicitly casting to Error
        res.status(500).json({ error: error.message });
    }
};

// Fetch all pages
export const getAllPages = async (_req: Request, res: Response) => {
  try {
    const result = await poolDB.query(
      "SELECT id, title, slug FROM pages ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

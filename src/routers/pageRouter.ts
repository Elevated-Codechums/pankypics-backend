import { Router, Request, Response } from 'express';
import { createPage, getPageBySlug, updatePage, deletePage, getAllPages } from '../controllers/pageController.js';

const router = Router();

// Wrap each controller function explicitly
router.post('/', async (req: Request, res: Response) => {
    await createPage(req, res);
});

router.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
    await getPageBySlug(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
    await updatePage(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
    await deletePage(req, res);
});

router.get("/", getAllPages);

export default router;

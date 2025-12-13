import { Router } from 'express';
import { listSweets, createSweet, searchSweets, updateSweet, deleteSweet, purchaseSweet, restockSweet } from '../controllers/sweets.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, listSweets);
router.get('/search', authMiddleware, searchSweets);
router.post('/', authMiddleware, createSweet);
router.put('/:id', authMiddleware, updateSweet);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSweet);
router.post('/:id/purchase', authMiddleware, purchaseSweet);
router.post('/:id/restock', authMiddleware, adminMiddleware, restockSweet);

export default router;

import { Router } from 'express';
import { getAllBooks, getBookByCode } from '../controllers/libroController';

const router = Router();

router.get('/', getAllBooks);
router.get('/codigo/:code', getBookByCode);

export default router; 
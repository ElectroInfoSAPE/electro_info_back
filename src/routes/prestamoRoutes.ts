import { Router } from 'express';
import { getPrestamo, returnLoan, renewLoan, makeLoan } from '../controllers/prestamoController';

const router = Router();

router.get('/:id', getPrestamo);
router.post('/', makeLoan);
router.post('/:id/devolver', returnLoan);
router.post('/:id/renovar', renewLoan);

export default router; 
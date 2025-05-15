import { Router } from 'express';
import { getUser } from '../controllers/usuarioController';

const router = Router();

router.get('/:id', getUser);

export default router; 
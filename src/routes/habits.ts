import { Router } from 'express';
import { create, getById, list, update } from '../controllers/habits';

const router = Router();

router.post('/', create);

router.get('/', list);

router.get('/:id', getById);

router.patch('/:id', update);

export default router;

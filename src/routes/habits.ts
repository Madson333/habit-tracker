import { Router } from 'express';
import { create } from '../controllers/habits';

const router = Router();

router.post('/', create);

export default router;

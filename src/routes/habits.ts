import { Router } from 'express';
import {
  create,
  deleteHabit,
  getById,
  list,
  update
} from '../controllers/habits';
import { getStats } from '../controllers/stats';
import { checkinsRouter } from './checkins';

const router = Router();

router.post('/', create);

router.get('/', list);

router.get('/:id', getById);

router.patch('/:id', update);

router.delete('/:id', deleteHabit);

router.get('/:id/stats', getStats);

router.use('/:id/checkins', checkinsRouter);

export default router;

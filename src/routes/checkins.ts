import { Router } from 'express';
import {
  createCheckin,
  listCheckins,
  removeCheckin
} from '../controllers/checkins';

export const checkinsRouter = Router({ mergeParams: true });

checkinsRouter.post('/', createCheckin);

checkinsRouter.delete('/:date', removeCheckin);

checkinsRouter.get('/', listCheckins);

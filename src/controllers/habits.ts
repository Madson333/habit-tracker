import { RequestHandler } from 'express';
import { Habit } from '../models/habit';

export const create: RequestHandler = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'Request body is required' });
    return;
  }

  const { title, observations, frequency, color, icon } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ message: 'Title is required and must be a string' });
    return;
  }

  const habit = await Habit.create({
    title,
    observations,
    frequency,
    color,
    icon
  });
  res.status(201).json(habit);
};

import { RequestHandler } from 'express';
import { Habit } from '../models/habit';

export const create: RequestHandler = async (req, res) => {
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
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

export const list: RequestHandler = async (req, res) => {
  const archivedHabits = req.query.archived === 'true';

  const habits = await Habit.find({ archived: archivedHabits }).sort({
    createdAt: -1
  });
  res.status(200).json(habits);
};

export const getById: RequestHandler = async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }
  res.status(200).json(habit);
};

export const update: RequestHandler = async (req, res) => {
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({ message: 'Request body is required' });
    return;
  }

  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }

  const newHabit = req.body;

  const updatedHabit = await Habit.findByIdAndUpdate(habit, newHabit, {
    returnDocument: 'after',
    runValidators: true
  });
  await habit.save();

  res.status(200).json(updatedHabit);
};

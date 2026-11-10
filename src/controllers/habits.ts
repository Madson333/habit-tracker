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

  const { title, frequency, observations, color, icon } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ message: 'Title is required and must be a string' });
    return;
  }

  const habit = await Habit.create({
    title,
    frequency,
    observations,
    color,
    icon,
    archived: false
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

  const { title, frequency, observations, color, icon, archived } = req.body;

  const changes = Object.fromEntries(
    Object.entries({
      title,
      observations,
      frequency,
      color,
      icon,
      archived
    }).filter(([, value]) => value !== undefined)
  );

  if (Object.keys(changes).length === 0) {
    res.status(400).json({ message: 'No valid fields provided for update' });
    return;
  }

  const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, changes, {
    returnDocument: 'after',
    runValidators: true
  });

  if (!updatedHabit) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }

  res.status(200).json(updatedHabit);
};

export const deleteHabit: RequestHandler = async (req, res) => {
  const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
  if (!deletedHabit) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }
  res.status(204).end();
};

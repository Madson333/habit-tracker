import { RequestHandler } from 'express';
import { Checkin } from '../models/checkin';
import { Habit } from '../models/habit';

export const createCheckin: RequestHandler = async (req, res) => {
  if (
    !req.body ||
    Object.keys(req.body).length === 0 ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({ message: 'Invalid request body' });
    return;
  }

  const { date } = req.body;

  if (!date || typeof date !== 'string') {
    res.status(400).json({ message: 'Date is required and must be a string' });
    return;
  }

  if (!req.params.id || typeof req.params.id !== 'string') {
    res
      .status(400)
      .json({ message: 'Habit ID is required and must be a string' });
    return;
  }

  const habitExists = await Habit.exists({ _id: req.params.id });

  if (!habitExists) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }

  const checkin = await Checkin.create({
    habit: req.params.id,
    date
  });
  res.status(201).json(checkin);
};

export const removeCheckin: RequestHandler = async (req, res) => {
  if (!req.params.id || typeof req.params.id !== 'string') {
    res
      .status(400)
      .json({ message: 'Habit ID is required and must be a string' });
    return;
  }

  const { date } = req.params;
  const checkin = await Checkin.findOneAndDelete({
    habit: req.params.id,
    date
  });

  if (!checkin) {
    res.status(404).json({ message: 'Check-in not found' });
    return;
  }

  res.status(204).end();
};

export const listCheckins: RequestHandler = async (req, res) => {
  const fromDate = req.query.from as string | undefined;
  const toDate = req.query.to as string | undefined;

  if (fromDate && typeof fromDate !== 'string') {
    res.status(400).json({ message: 'from query parameter must be a string' });
    return;
  }

  if (
    (toDate && typeof toDate !== 'string') ||
    (fromDate && toDate && fromDate > toDate)
  ) {
    res.status(400).json({ message: 'to query parameter must be a string' });
    return;
  }

  const dateFilter: Record<string, unknown> = {};

  if (fromDate) {
    dateFilter.$gte = fromDate;
  }

  if (toDate) {
    dateFilter.$lte = toDate;
  }

  const checkins = await Checkin.find({
    habit: req.params.id,
    ...(fromDate || toDate ? { date: dateFilter } : {})
  }).sort({
    date: -1
  });
  res.status(200).json(checkins);
};

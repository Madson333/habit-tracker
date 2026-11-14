import { RequestHandler } from 'express';
import { Checkin } from '../models/checkin';
import { Habit } from '../models/habit';
import { addDays, formatDate, isValidDay } from '../utils/date';

const MIN_CHECKIN_DATE = '2000-01-01';
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

// undefined → padrão; inteiro entre 1 e MAX_LIMIT → o valor; qualquer outra coisa → null (inválido)
function parseLimit(value: unknown): number | null {
  if (value === undefined) return DEFAULT_LIMIT;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;

  const limit = Number(value);
  return limit >= 1 && limit <= MAX_LIMIT ? limit : null;
}

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

  if (!isValidDay(date)) {
    res.status(400).json({ message: 'Invalid date format' });
    return;
  }

  const maxDate = addDays(formatDate(new Date()), 1);

  if (date < MIN_CHECKIN_DATE || date > maxDate) {
    res.status(400).json({ message: 'Date out of allowed range' });
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
  const { date } = req.params;

  const isValid = isValidDay(String(date));

  if (!isValid) {
    res.status(400).json({ message: 'Invalid date format' });
    return;
  }
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
  const toDate = req.query.to as string | undefined;
  const fromDate = req.query.from as string | undefined;
  const limit = parseLimit(req.query.limit);
  const beforeDate = req.query.before;

  const fromValid = fromDate ? isValidDay(fromDate) : true;
  const toValid = toDate ? isValidDay(toDate) : true;

  if (!fromValid) {
    res.status(400).json({ message: 'Invalid from date format' });
    return;
  }

  if (!toValid) {
    res.status(400).json({ message: 'Invalid to date format' });
    return;
  }

  if (limit === null) {
    res
      .status(400)
      .json({ message: `Limit must be an integer between 1 and ${MAX_LIMIT}` });
    return;
  }

  if (beforeDate !== undefined && !isValidDay(beforeDate)) {
    res.status(400).json({ message: 'Invalid before date format' });
    return;
  }

  if (fromDate && toDate && fromDate > toDate) {
    res.status(400).json({ message: 'from must be before or equal to to' });
    return;
  }

  const habitExists = await Habit.exists({ _id: req.params.id });

  if (!habitExists) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }

  const dateFilter: Record<string, unknown> = {};

  if (fromDate) {
    dateFilter.$gte = fromDate;
  }

  if (toDate) {
    dateFilter.$lte = toDate;
  }

  if (beforeDate) dateFilter.$lt = beforeDate;

  const checkins = await Checkin.find({
    habit: req.params.id,
    ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
  })
    .sort({
      date: -1
    })
    .limit(limit + 1);
  const hasMore = checkins.length > limit;

  const items = hasMore ? checkins.slice(0, limit) : checkins;

  const nextCursor = hasMore ? (items[items.length - 1]?.date ?? null) : null;

  res.status(200).json({
    items,
    nextCursor
  });
};

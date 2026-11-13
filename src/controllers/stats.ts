import { RequestHandler } from 'express';
import { Checkin } from '../models/checkin';
import { Habit } from '../models/habit';
import { computeStreaks, monthCompletion } from '../services/stats';
import { formatDate, isValidDay, isValidMonth } from '../utils/date';

export const getStats: RequestHandler<{ id: string }> = async (req, res) => {
  const { today: todayQuery, month: monthQuery } = req.query;

  if (todayQuery !== undefined && !isValidDay(todayQuery)) {
    res.status(400).json({ message: 'Invalid today date' });
    return;
  }

  if (monthQuery !== undefined && !isValidMonth(monthQuery)) {
    res.status(400).json({ message: 'Invalid month, expected YYYY-MM' });
    return;
  }

  const today = todayQuery ?? formatDate(new Date());
  const month = monthQuery ?? today.slice(0, 7);

  const habit = await Habit.findById(req.params.id).select(
    'frequency createdAt'
  );

  if (!habit) {
    res.status(404).json({ message: 'Habit not found' });
    return;
  }

  const checkins = await Checkin.find({ habit: habit._id }).select('date');
  const dates = checkins.map((checkin) => checkin.date);

  const createdDay = formatDate(habit.createdAt);
  const start = dates.reduce((min, day) => (day < min ? day : min), createdDay);

  const { currentStreak, bestStreak } = computeStreaks({
    dates,
    frequency: habit.frequency,
    start,
    today
  });

  const monthStats = monthCompletion({
    dates,
    frequency: habit.frequency,
    start,
    today,
    month
  });

  res.status(200).json({ currentStreak, bestStreak, month: monthStats });
};

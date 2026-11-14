import mongoose from 'mongoose';
import { connectToDatabase } from '../db';
import { Habit } from '../models/habit';
import { Checkin } from '../models/checkin';
import { addDays, formatDate } from '../utils/date';

const DAYS = 1095;

async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');

  await connectToDatabase(uri);

  if (!mongoose.connection.name.endsWith('-seed')) {
    throw new Error('Database name must end with "-seed" for seeding');
  }

  await Checkin.deleteMany({});
  await Habit.deleteMany({});

  const habit = await Habit.create({
    title: 'Daily Habit',
    frequency: [0, 1, 2, 3, 4, 5, 6],
    observations: 'This is a daily habit for seeding purposes.',
    color: '#FF5733',
    icon: '🔥',
    archived: false
  });

  const dateToday = formatDate(new Date());

  await Checkin.insertMany(
    Array.from({ length: DAYS }, (_, i) => {
      const date = addDays(dateToday, -i);
      return { habit: habit._id, date };
    })
  );

  console.log(`Seeded ${DAYS} check-ins`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

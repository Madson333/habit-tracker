import { addDays, dayOfWeek, daysInMonth } from '../utils/date';

export function computeStreaks(checkins: {
  dates: string[];
  frequency: number[];
  start: string;
  today: string;
}): { currentStreak: number; bestStreak: number } {
  const done = new Set(checkins.dates);
  const frequency = checkins.frequency;
  const firstDay = checkins.start;
  const today = checkins.today;

  function countCurrentStreak(
    done: Set<string>,
    frequency: number[],
    firstDay: string,
    today: string
  ): number {
    let run = 0;
    let day =
      frequency.includes(dayOfWeek(today)) && !done.has(today)
        ? addDays(today, -1)
        : today;
    while (day >= firstDay) {
      const isExpected = frequency.includes(dayOfWeek(day));
      if (isExpected) {
        if (!done.has(day)) break;
        run++;
      }
      day = addDays(day, -1);
    }
    return run;
  }

  function findBestStreak(
    done: Set<string>,
    frequency: number[],
    firstDay: string,
    today: string
  ): number {
    let best = 0;
    let run = 0;
    for (let day = firstDay; day <= today; day = addDays(day, 1)) {
      if (!frequency.includes(dayOfWeek(day))) continue;
      if (!done.has(day)) {
        run = 0;
      } else {
        run++;
        best = Math.max(best, run);
      }
    }
    return best;
  }

  return {
    currentStreak: countCurrentStreak(done, frequency, firstDay, today),
    bestStreak: findBestStreak(done, frequency, firstDay, today)
  };
}

export function monthCompletion(checkins: {
  dates: string[];
  frequency: number[];
  start: string;
  today: string;
  month: string;
}): { month: string; expected: number; done: number; percentage: number } {
  const { dates, frequency, start, today, month } = checkins;
  const done = new Set(dates);

  const [year, monthNumber] = month.split('-').map(Number);
  const lastDay = String(daysInMonth(year!, monthNumber!)).padStart(2, '0');
  const firstOfMonth = `${month}-01`;
  const lastOfMonth = `${month}-${lastDay}`;

  const windowStart = start > firstOfMonth ? start : firstOfMonth;
  const windowEnd = today < lastOfMonth ? today : lastOfMonth;

  let expected = 0;
  let completed = 0;

  for (let day = windowStart; day <= windowEnd; day = addDays(day, 1)) {
    if (!frequency.includes(dayOfWeek(day))) continue;
    if (day === today && !done.has(day)) continue;
    expected++;
    if (done.has(day)) completed++;
  }

  const percentage =
    expected > 0 ? Math.round((completed / expected) * 1000) / 10 : 0;

  return { month, expected, done: completed, percentage };
}

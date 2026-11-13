import { addDays, dayOfWeek } from '../utils/date';

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

  function currentCleanRun(
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

  function bestCleanRun(
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
    currentStreak: currentCleanRun(done, frequency, firstDay, today),
    bestStreak: bestCleanRun(done, frequency, firstDay, today)
  };
}

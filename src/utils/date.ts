export function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export function isValidDay(dateString: string) {
  if (typeof dateString !== 'string' || !dateRegex.test(dateString))
    return false;

  const dateConverted = new Date(dateString);

  if (isNaN(dateConverted.getTime())) {
    return false;
  }

  const dateCompared = formatDate(dateConverted);
  return dateCompared === dateString;
}

export function dayOfWeek(dateString: string) {
  const date = new Date(dateString);
  return date.getUTCDay();
}

export function addDays(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

export function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

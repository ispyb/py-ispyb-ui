import format from 'date-fns/format';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import { isMatch } from 'date-fns';

export function formatDateToDay(dateTime: string | undefined): string {
  return formatDateTo(dateTime, 'dd/MM/yyyy');
}
export function formatDateToDayAndTime(dateTime: string | undefined): string {
  return formatDateTo(dateTime, 'dd/MM/yyyy HH:mm:ss');
}
export function formatDateToDayAndPreciseTime(
  dateTime: string | undefined
): string {
  return formatDateTo(dateTime, 'dd/MM/yyyy HH:mm:ss.SSS');
}

/**
 *
 * @param dateTime
 * @param outputFormat
 * @returns
 */
export function formatDateTo(
  dateTime: string | undefined,
  outputFormat: string
): string {
  if (dateTime === undefined) return 'No date';
  try {
    return format(parseDate(dateTime), outputFormat);
  } catch (e) {
    return 'Invalid date';
  }
}

export function dateToTimestamp(dateTime?: string): number {
  if (dateTime) {
    return parseDate(dateTime).getTime();
  }
  return 0;
}

export function parseDate(dateTime: string | undefined): Date {
  if (!dateTime) return new Date(0);
  const formats = ['MMM d, yyyy h:mm:ss aaa', "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"];
  for (const myFormat of formats) {
    if (isMatch(dateTime, myFormat)) {
      return parse(dateTime, myFormat, new Date());
    }
  }
  return parseISO(dateTime);
}

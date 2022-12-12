import format from 'date-fns/format';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import { isMatch } from 'date-fns';

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
  if (dateTime) {
    return format(parseDate(dateTime), outputFormat);
  }
  return '';
}

export function dateToTimestamp(dateTime?: string): number {
  if (dateTime) {
    return parseDate(dateTime).getTime();
  }
  return 0;
}

export function parseDate(dateTime: string): Date {
  const formats = ['MMM d, yyyy h:mm:ss aaa'];
  for (const myFormat of formats) {
    if (isMatch(dateTime, myFormat)) {
      return parse(dateTime, myFormat, new Date());
    }
  }
  return parseISO(dateTime);
}

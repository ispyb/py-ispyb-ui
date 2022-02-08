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
export function formatDateTo(dateTime: string, outputFormat: string): string {
  const formats = ['MMM d, yyyy h:mm:ss aaa'];
  for (const myFormat of formats) {
    if (isMatch(dateTime, myFormat)) {
      return format(parse(dateTime, myFormat, new Date()), outputFormat);
    }
  }
  return format(parseISO(dateTime), outputFormat);
}

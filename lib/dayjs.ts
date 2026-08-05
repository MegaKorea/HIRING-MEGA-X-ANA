import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale('vi');

export default dayjs;

export const DateFormat = {
  DATE: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  ISO_DATE: 'YYYY-MM-DD',
} as const;

export function formatDate(
  value: string | number | Date | dayjs.Dayjs | null | undefined,
  format: string = DateFormat.DATE,
): string {
  if (value == null || value === '') return '';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(format) : '';
}

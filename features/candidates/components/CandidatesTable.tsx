'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CandidateRecord } from '@/features/candidates/api';
import { cn } from '@/lib/utils';

const HEAD =
  'h-11 whitespace-nowrap bg-muted/40 px-3 py-0 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase';
const CELL = 'whitespace-nowrap px-3 py-3 align-middle';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

// Lark Date fields come back as epoch-ms — years 2000–2100 covers real dates without
// misreading other numeric fields (age, salary, ...), which stay well below this range.
function isEpochMs(value: number): boolean {
  return value > 946684800000 && value < 4102444800000;
}

const TEXT_DATE_PATTERN = /^(\d{4})\/(\d{2})\/(\d{2})$/;

// Some Lark fields (formula/text columns like "NGAY PV") store dates as "yyyy/mm/dd" text
// instead of a real Date field — normalize to the same dd/mm/yyyy used everywhere else.
function normalizeTextDate(text: string): string {
  const match = text.match(TEXT_DATE_PATTERN);
  if (!match) return text;
  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}

// ponytail: generic formatter for unknown Bitable field shapes — add per-type rendering
// (attachments, user avatars) once the candidate table schema is fixed.
function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number' && isEpochMs(value)) {
    return dateFormatter.format(new Date(value));
  }
  if (typeof value === 'string') return normalizeTextDate(value);
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    const joined = value
      .map(formatFieldValue)
      .filter((v) => v !== '—')
      .join(', ');
    return joined || '—';
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.text === 'string') return normalizeTextDate(obj.text);
    if (typeof obj.name === 'string') return obj.name;
    return JSON.stringify(value);
  }
  return String(value);
}

type CandidatesTableProps = {
  records: CandidateRecord[];
  columns: string[];
};

export function CandidatesTable({ records, columns }: CandidatesTableProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-none border border-border bg-card shadow-[var(--shadow-soft)]">
      <Table containerClassName="overflow-x-auto">
        <TableHeader>
          <TableRow className="border-border/80 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col} className={HEAD}>
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.record_id}
              className="border-border/60 transition-colors hover:bg-accent/40"
            >
              {columns.map((col) => (
                <TableCell key={col} className={cn(CELL, 'text-foreground')}>
                  {formatFieldValue(record.fields[col])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

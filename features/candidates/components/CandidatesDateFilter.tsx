'use client';

import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';

dayjs.extend(customParseFormat);

const ISO_FORMAT = 'YYYY-MM-DD';
const DISPLAY_FORMAT = 'DD/MM/YYYY';
const ACCEPTED_INPUT_FORMATS = ['DD/MM/YYYY', 'D/M/YYYY', 'DDMMYYYY', 'YYYY-MM-DD'];

function toDisplay(iso: string | null): string {
  if (!iso) return '';
  const parsed = dayjs(iso, ISO_FORMAT, true);
  return parsed.isValid() ? parsed.format(DISPLAY_FORMAT) : '';
}

type DateFieldProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  ariaLabel: string;
};

// ponytail: showPicker() has no fallback on unsupported browsers (Safari < 16.4) — the
// text field still works there, just the calendar icon does nothing. Add a fallback if needed.
function DateField({ value, onChange, disabled, ariaLabel }: DateFieldProps) {
  const [text, setText] = useState(() => toDisplay(value));
  const [syncedValue, setSyncedValue] = useState(value);
  const pickerRef = useRef<HTMLInputElement>(null);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(toDisplay(value));
  }

  function commitText(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) {
      onChange(null);
      return;
    }
    const parsed = dayjs(trimmed, ACCEPTED_INPUT_FORMATS, true);
    if (parsed.isValid()) {
      onChange(parsed.format(ISO_FORMAT));
    } else {
      setText(toDisplay(value));
    }
  }

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/yyyy"
        className="w-[120px] bg-background pr-8"
        value={text}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commitText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
      />
      <button
        type="button"
        className="absolute right-2 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        disabled={disabled}
        onClick={() => pickerRef.current?.showPicker?.()}
        aria-label={`Mở lịch chọn ${ariaLabel.toLowerCase()}`}
      >
        <CalendarDays className="size-4" />
      </button>
      <input
        ref={pickerRef}
        type="date"
        value={value ?? ''}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => onChange(e.target.value || null)}
      />
    </div>
  );
}

type CandidatesDateFilterProps = {
  from: string | null;
  to: string | null;
  onChange: (range: { from: string | null; to: string | null }) => void;
  disabled?: boolean;
};

export function CandidatesDateFilter({ from, to, onChange, disabled }: CandidatesDateFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <DateField
        value={from}
        onChange={(next) => onChange({ from: next, to })}
        disabled={disabled}
        ariaLabel="Từ ngày"
      />
      <span className="text-sm text-muted-foreground">–</span>
      <DateField
        value={to}
        onChange={(next) => onChange({ from, to: next })}
        disabled={disabled}
        ariaLabel="Đến ngày"
      />
    </div>
  );
}

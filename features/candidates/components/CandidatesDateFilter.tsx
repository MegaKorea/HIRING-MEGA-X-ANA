'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function isoToDate(iso: string | null): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dateToIso(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const displayFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

type DateFieldProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  placeholder: string;
};

function DateField({ value, onChange, disabled, placeholder }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = isoToDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[140px] justify-start gap-2 bg-background font-normal',
            !selected && 'text-muted-foreground',
          )}
        >
          <CalendarDays className="size-4" />
          {selected ? displayFormatter.format(selected) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          onSelect={(date) => {
            onChange(date ? dateToIso(date) : null);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
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
        placeholder="Từ ngày"
      />
      <span className="text-sm text-muted-foreground">–</span>
      <DateField
        value={to}
        onChange={(next) => onChange({ from, to: next })}
        disabled={disabled}
        placeholder="Đến ngày"
      />
    </div>
  );
}

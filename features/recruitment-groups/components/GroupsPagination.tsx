'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GroupsPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function GroupsPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: GroupsPaginationProps) {
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-sm text-muted-foreground sm:text-left">
        <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span>
        <span className="mx-1">/</span>
        {total} nhóm
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          <span className="sm:inline">Trước</span>
        </Button>
        <span className="min-w-16 text-center text-sm tabular-nums text-muted-foreground">
          {page}/{totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-end"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="sm:inline">Sau</span>
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}

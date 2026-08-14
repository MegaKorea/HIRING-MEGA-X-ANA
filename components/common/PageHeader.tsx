'use client';

import type { ReactNode } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching() > 0;

  return (
    <FadeIn
      className={cn('mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="min-w-0">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="mb-0 max-w-2xl text-sm text-balance text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button
          variant="outline"
          disabled={isFetching}
          onClick={() => void queryClient.invalidateQueries()}
          title="Tải lại dữ liệu của trang"
        >
          <RefreshCw data-icon="inline-start" className={cn(isFetching && 'animate-spin')} />
          Làm mới
        </Button>
        {actions}
      </div>
    </FadeIn>
  );
}

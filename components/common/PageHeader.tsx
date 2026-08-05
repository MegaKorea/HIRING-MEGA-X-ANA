'use client';

import type { ReactNode } from 'react';
import { FadeIn } from './FadeIn';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
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
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </FadeIn>
  );
}

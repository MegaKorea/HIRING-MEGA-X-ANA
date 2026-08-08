'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  tip?: string;
  className?: string;
  fullHeight?: boolean;
}

export function LoadingState({
  tip = 'Đang tải...',
  className,
  fullHeight = true,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-muted-foreground',
        fullHeight ? 'min-h-[240px]' : 'py-10',
        className,
      )}
    >
      <Loader2 className="size-8 animate-spin text-primary" />
      <span className="text-sm">{tip}</span>
    </div>
  );
}

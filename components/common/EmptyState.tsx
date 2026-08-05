'use client';

import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FadeIn } from './FadeIn';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  image?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'Chưa có dữ liệu',
  description = 'Khi có dữ liệu mới, nội dung sẽ hiện tại đây.',
  actionLabel,
  onAction,
  image,
  className,
}: EmptyStateProps) {
  return (
    <FadeIn className={cn(className)}>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="flex min-h-[280px] items-center justify-center py-16">
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">{image ?? <Inbox />}</EmptyMedia>
              <EmptyTitle className="text-base">{title}</EmptyTitle>
              <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            {actionLabel && onAction ? (
              <EmptyContent>
                <Button onClick={onAction}>{actionLabel}</Button>
              </EmptyContent>
            ) : null}
          </Empty>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

'use client';

import type { ReactNode } from 'react';
import { EmptyState, PageHeader } from '@/components/common';

interface PlaceholderPageProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  actions?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function PlaceholderPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  actions,
  actionLabel,
  onAction,
}: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} actions={actions} />
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={actionLabel}
        onAction={onAction}
      />
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { AppHeader } from './Header';
import { AppSidebar } from './Sidebar';
import { PageTransitionOverlay } from '@/components/common/PageTransitionOverlay';
import { THEME } from '@/constants/theme';

interface AppLayoutProps {
  children: ReactNode;
}

const panelRadius = THEME.borderRadius.panel;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-svh gap-3 bg-muted/50 p-3">
      <PageTransitionOverlay />
      <AppSidebar />
      <div
        className="flex min-h-[calc(100svh-1.5rem)] min-w-0 flex-1 flex-col overflow-hidden bg-card shadow-sm ring-1 ring-foreground/5"
        style={{ borderRadius: panelRadius }}
      >
        <AppHeader />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-background/60 px-4 py-5 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

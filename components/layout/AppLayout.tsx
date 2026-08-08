'use client';

import type { ReactNode } from 'react';
import { AppHeader } from './Header';
import { AppSidebar } from './Sidebar';
import { PageTransitionOverlay } from '@/components/common/PageTransitionOverlay';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-svh bg-background">
      <PageTransitionOverlay />
      <AppSidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-card">
        <AppHeader />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-background/60 px-4 py-5 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

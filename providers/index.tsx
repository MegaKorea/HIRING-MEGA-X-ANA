'use client';

import { type ReactNode } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from '@/lib/hooks/use-theme';
import { NavigationProvider } from '@/lib/contexts/navigation.context';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import '@/lib/dayjs';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider>
        <QueryProvider>
          <TooltipProvider>
            <NavigationProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <Toaster richColors closeButton position="top-right" />
            </NavigationProvider>
          </TooltipProvider>
        </QueryProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}

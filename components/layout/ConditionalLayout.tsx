'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppLayout } from './AppLayout';
import { AUTH_ROUTES } from '@/constants/routes';

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBare = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isBare) return children;

  return <AppLayout>{children}</AppLayout>;
}

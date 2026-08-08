'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { APP_MENU, type MenuItem } from '@/constants/menu';

export function useActiveMenuItem(): MenuItem {
  const pathname = usePathname();

  return useMemo(() => {
    const exact = APP_MENU.find((item) => item.path === pathname);
    if (exact) return exact;

    const nested = APP_MENU.filter(
      (item) => item.path !== '/' && pathname.startsWith(item.path),
    ).sort((a, b) => b.path.length - a.path.length)[0];

    return nested ?? APP_MENU[0];
  }, [pathname]);
}

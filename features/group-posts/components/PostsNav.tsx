'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type PostNavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

const POST_NAV: PostNavItem[] = [
  { href: '/posts', label: 'Soạn bài', exact: true },
  { href: '/posts/content', label: 'Content' },
];

function isActivePath(pathname: string, item: PostNavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function PostsNav() {
  const pathname = usePathname();

  return (
    <nav className="inline-flex w-full items-center gap-1 rounded-none bg-muted p-[3px] sm:w-auto">
      {POST_NAV.map((item) => {
        const active = isActivePath(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 rounded-none px-2.5 py-1.5 text-center text-sm font-medium whitespace-nowrap transition-colors sm:flex-none sm:px-3',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

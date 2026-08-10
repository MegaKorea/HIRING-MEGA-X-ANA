'use client';

import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { BrandLogo } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { APP_MENU } from '@/constants/menu';
import { THEME } from '@/constants/theme';
import { useNavigation } from '@/lib/contexts/navigation.context';
import { useActiveMenuItem } from '@/lib/hooks/use-active-menu';
import { useMobile } from '@/lib/hooks/use-mobile';
import { useLayoutStore } from '@/lib/stores/layout.store';
import { cn } from '@/lib/utils';

function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3', compact && 'justify-center')}>
      <BrandLogo size={compact ? 32 : 36} className="shrink-0" />
      {!compact ? (
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-semibold text-foreground">Hiring Tools</div>
        </div>
      ) : null}
    </div>
  );
}

function NavItems({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const active = useActiveMenuItem();
  const { navigateWithDelay } = useNavigation();

  return (
    <nav className="flex flex-col gap-1">
      {APP_MENU.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === active.key;

        const button = (
          <Button
            type="button"
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'h-10 w-full justify-start gap-3 rounded-none px-3',
              compact && 'size-10 justify-center px-0',
              isActive &&
                'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            onClick={() => {
              navigateWithDelay(item.path);
              onNavigate?.();
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={cn('size-4 shrink-0', isActive && 'text-primary')} />
            {!compact ? <span className="truncate">{item.label}</span> : null}
          </Button>
        );

        if (!compact) return <div key={item.key}>{button}</div>;

        return (
          <Tooltip key={item.key}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

function NavPanel({
  compact,
  onNavigate,
  showCollapse,
}: {
  compact?: boolean;
  onNavigate?: () => void;
  showCollapse?: boolean;
}) {
  const toggleCollapsed = useLayoutStore((s) => s.toggleCollapsed);

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-[var(--header-height)] shrink-0 items-center border-b border-border px-3',
          compact && 'justify-center px-2',
        )}
      >
        <BrandMark compact={compact} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <NavItems compact={compact} onNavigate={onNavigate} />
      </div>

      {showCollapse ? (
        <div className="shrink-0 border-t border-border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  'h-10 w-full justify-start gap-3 rounded-none',
                  compact && 'size-10 justify-center px-0',
                )}
                onClick={toggleCollapsed}
                aria-label={compact ? 'Mở rộng menu' : 'Thu gọn menu'}
              >
                {compact ? <PanelLeftOpen /> : <PanelLeftClose />}
                {!compact ? <span>Thu gọn</span> : null}
              </Button>
            </TooltipTrigger>
            {compact ? <TooltipContent side="right">Mở rộng</TooltipContent> : null}
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
}

export function AppSidebar() {
  const collapsed = useLayoutStore((s) => s.collapsed);
  const mobileOpen = useLayoutStore((s) => s.mobileOpen);
  const setMobileOpen = useLayoutStore((s) => s.setMobileOpen);
  const isMobile = useMobile();
  const width = collapsed ? THEME.layout.sidebarCollapsed : THEME.layout.sidebarWidth;

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[280px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu điều hướng</SheetTitle>
          </SheetHeader>
          <NavPanel onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className="sticky top-0 z-40 hidden h-svh shrink-0 border-r border-border bg-card transition-[width] duration-200 md:block"
      style={{ width }}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <NavPanel compact={collapsed} showCollapse />
      </div>
    </aside>
  );
}

export function MobileNavTrigger() {
  const setMobileOpen = useLayoutStore((s) => s.setMobileOpen);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-none md:hidden"
      aria-label="Mở menu"
      onClick={() => setMobileOpen(true)}
    >
      <Menu />
    </Button>
  );
}

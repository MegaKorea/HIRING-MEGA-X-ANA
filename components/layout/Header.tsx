'use client';

import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { MobileNavTrigger } from '@/components/layout/Sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeMode } from '@/constants/enums/theme.enum';
import { useNavigation } from '@/lib/contexts/navigation.context';
import { useActiveMenuItem } from '@/lib/hooks/use-active-menu';
import { useTheme } from '@/lib/hooks/use-theme';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const router = useRouter();
  const { themeMode, toggleTheme } = useTheme();
  const { navigateWithDelay } = useNavigation();
  const currentPage = useActiveMenuItem();
  const PageIcon = currentPage.icon;

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Đã đăng xuất');
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 h-[var(--header-height)] shrink-0 border-b border-border bg-card">
      <div className="flex h-full items-center gap-3 px-4 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <MobileNavTrigger />

          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <PageIcon className="size-3.5" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-foreground">
                {currentPage.label}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">Hệ thống tuyển dụng</div>
            </div>
          </div>

          <button
            type="button"
            className={cn(
              'ml-1 hidden h-9 max-w-md flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 text-left text-[13px] text-muted-foreground transition',
              'hover:border-[var(--border-strong)] hover:bg-muted/40 lg:flex',
            )}
            onClick={() => toast.message('Tìm kiếm sẽ sớm có')}
          >
            <Search className="size-3.5 shrink-0" />
            <span className="flex-1 truncate">Tìm ứng viên, tin tuyển dụng...</span>
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Tìm kiếm"
                onClick={() => toast.message('Tìm kiếm sẽ sớm có')}
              >
                <Search />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tìm kiếm</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Đổi giao diện sáng/tối"
              >
                {themeMode === ThemeMode.DARK ? <Sun /> : <Moon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {themeMode === ThemeMode.DARK ? 'Chế độ sáng' : 'Chế độ tối'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Thông báo" className="relative">
                <Bell />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Thông báo</TooltipContent>
          </Tooltip>

          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-muted"
              >
                <Avatar className="size-7 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left sm:block">
                  <span className="block text-[13px] leading-tight font-medium text-foreground">
                    Admin
                  </span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">
                    Quản trị viên
                  </span>
                </span>
                <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm font-medium text-foreground">Admin</div>
                <div className="text-xs text-muted-foreground">admin@ana.edu.vn</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigateWithDelay('/settings')}>
                <User />
                Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateWithDelay('/settings')}>
                <Settings />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

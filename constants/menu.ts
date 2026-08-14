import type { LucideIcon } from 'lucide-react';
import { FileText, History, PenSquare, UsersRound } from 'lucide-react';

export type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

export const APP_MENU: MenuItem[] = [
  { key: 'groups', label: 'Danh sách nhóm', path: '/groups', icon: UsersRound },
  { key: 'posts', label: 'Đăng bài', path: '/posts', icon: PenSquare },
  { key: 'post-content', label: 'Content', path: '/posts/content', icon: FileText },
  { key: 'post-history', label: 'Lịch sử đăng bài', path: '/posts/history', icon: History },
];

export { APP_BRAND, APP_ICON, APP_NAME } from './brand';

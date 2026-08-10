import type { LucideIcon } from 'lucide-react';
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  History,
  LayoutDashboard,
  PenSquare,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react';

export type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

export const APP_MENU: MenuItem[] = [
  { key: 'overview', label: 'Tổng quan', path: '/', icon: LayoutDashboard },
  { key: 'groups', label: 'Danh sách nhóm', path: '/groups', icon: UsersRound },
  { key: 'posts', label: 'Đăng bài', path: '/posts', icon: PenSquare },
  { key: 'post-content', label: 'Content', path: '/posts/content', icon: FileText },
  { key: 'post-history', label: 'Lịch sử đăng bài', path: '/posts/history', icon: History },
  { key: 'candidates', label: 'Ứng viên', path: '/candidates', icon: Users },
  { key: 'jobs', label: 'Tin tuyển dụng', path: '/jobs', icon: BriefcaseBusiness },
  { key: 'interviews', label: 'Phỏng vấn', path: '/interviews', icon: CalendarDays },
  { key: 'settings', label: 'Cài đặt', path: '/settings', icon: Settings },
];

export { APP_BRAND, APP_ICON, APP_NAME } from './brand';

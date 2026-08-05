import { ThemeMode } from './enums/theme.enum';

export type AppColors = Readonly<{
  primary: string;
  navActiveText: string;
  white: string;
  black: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  bgApp: string;
  bgSurface: string;
  bgSunken: string;
  bgHover: string;
  bgSelected: string;
  transparent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  borderStrong: string;
}>;

export const COLORS_LIGHT = {
  primary: '#EC008C',
  navActiveText: '#B8006D',
  white: '#FFFFFF',
  black: '#000000',
  success: '#16A34A',
  warning: '#D9880F',
  error: '#E5484D',
  info: '#3E7BFA',
  bgApp: '#F3F4F8',
  bgSurface: '#FFFFFF',
  bgSunken: '#EBECEF',
  bgHover: '#F0F1F5',
  bgSelected: '#FEF0F8',
  transparent: 'transparent',
  textPrimary: '#14161F',
  textSecondary: '#545A6E',
  border: '#E4E6EE',
  borderStrong: '#D0D3DE',
} as const satisfies AppColors;

export const COLORS_DARK = {
  primary: '#EC008C',
  navActiveText: '#F384C6',
  white: '#FFFFFF',
  black: '#000000',
  success: '#16A34A',
  warning: '#D9880F',
  error: '#E5484D',
  info: '#3E7BFA',
  bgApp: '#12141C',
  bgSurface: '#1A1D28',
  bgSunken: '#222633',
  bgHover: '#262A37',
  bgSelected: 'rgba(236, 0, 140, 0.18)',
  transparent: 'transparent',
  textPrimary: '#F1F2F6',
  textSecondary: '#A6ABBD',
  border: '#2E3240',
  borderStrong: '#3B4051',
} as const satisfies AppColors;

export function getColorsByTheme(themeMode: ThemeMode): AppColors {
  return themeMode === ThemeMode.DARK ? COLORS_DARK : COLORS_LIGHT;
}

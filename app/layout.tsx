import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import { APP_ICON, APP_NAME } from '@/constants/brand';
import { AppProviders } from '@/providers';
import { cn } from '@/lib/utils';
import './globals.css';

const lexend = Lexend({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${APP_NAME} ANA`,
  description: 'Hệ thống tuyển dụng ANA',
  icons: {
    icon: APP_ICON,
    shortcut: APP_ICON,
    apple: APP_ICON,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn(lexend.variable, 'h-full font-sans antialiased')}>
      <body className="flex min-h-full flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

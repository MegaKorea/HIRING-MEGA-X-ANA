'use client';

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FadeIn } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { THEME } from '@/constants/theme';
import { useNavigation } from '@/lib/contexts/navigation.context';
import { cn } from '@/lib/utils';

const PIPELINE = [
  {
    key: 'candidates',
    label: 'Ứng viên',
    hint: 'Trong pipeline',
    value: '0',
    icon: Users,
    href: '/candidates',
  },
  {
    key: 'jobs',
    label: 'Tin đang mở',
    hint: 'Đang tuyển',
    value: '0',
    icon: BriefcaseBusiness,
    href: '/jobs',
  },
  {
    key: 'interviews',
    label: 'Phỏng vấn',
    hint: 'Tuần này',
    value: '0',
    icon: CalendarDays,
    href: '/interviews',
  },
] as const;

const QUICK_LINKS = [
  {
    key: 'add-candidate',
    title: 'Thêm ứng viên',
    description: 'Tạo hồ sơ mới vào pipeline',
    href: '/candidates',
    icon: Plus,
  },
  {
    key: 'jobs',
    title: 'Mở tin tuyển dụng',
    description: 'Đăng vị trí đang cần người',
    href: '/jobs',
    icon: BriefcaseBusiness,
  },
  {
    key: 'interviews',
    title: 'Xếp lịch phỏng vấn',
    description: 'Gắn vòng đánh giá cho ứng viên',
    href: '/interviews',
    icon: CalendarDays,
  },
] as const;

function todayLabel() {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

export default function Home() {
  const { navigateWithDelay } = useNavigation();

  return (
    <div className="space-y-6">
      <FadeIn>
        <section className="relative overflow-hidden rounded-[min(var(--radius-4xl),28px)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_12%,white)_0%,var(--bg-surface)_42%,color-mix(in_srgb,var(--info)_8%,white)_100%)] px-6 py-7 ring-1 ring-foreground/5 sm:px-8 dark:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_22%,#1a1d28)_0%,var(--bg-surface)_50%,color-mix(in_srgb,var(--info)_14%,#1a1d28)_100%)]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-primary/15 blur-3xl"
            animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <Badge variant="secondary" className="mb-3 gap-1.5 rounded-full px-2.5 py-1">
                <Sparkles className="size-3.5 text-primary" />
                {todayLabel()}
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Xin chào, bắt đầu ngày tuyển dụng
              </h1>
              <p className="mt-2 text-sm text-balance text-muted-foreground sm:text-base">
                Theo dõi pipeline, ưu tiên ứng viên và lịch phỏng vấn cần xử lý hôm nay.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="lg" onClick={() => navigateWithDelay('/candidates')}>
                <Plus data-icon="inline-start" />
                Thêm ứng viên
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigateWithDelay('/jobs')}>
                Xem tin tuyển dụng
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <Card className="overflow-hidden py-0">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle>Pipeline nhanh</CardTitle>
            <CardDescription>Nhấn vào từng cột để mở module tương ứng.</CardDescription>
          </CardHeader>
          <CardContent className="grid p-0 sm:grid-cols-3">
            {PIPELINE.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.key}
                  type="button"
                  whileHover={{ y: -1 }}
                  transition={{ duration: THEME.motion.fast }}
                  onClick={() => navigateWithDelay(item.href)}
                  className={cn(
                    'group flex flex-col gap-4 p-5 text-left transition-colors hover:bg-accent/50',
                    index > 0 && 'border-t sm:border-t-0 sm:border-l',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-foreground">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.hint}</div>
                  </div>
                </motion.button>
              );
            })}
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <FadeIn delay={0.1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Việc nên làm tiếp</CardTitle>
              <CardDescription>Ba lối tắt thường dùng khi bắt đầu session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK_LINKS.map((link, index) => {
                const Icon = link.icon;
                return (
                  <div key={link.key}>
                    {index > 0 ? <Separator className="my-2" /> : null}
                    <button
                      type="button"
                      onClick={() => navigateWithDelay(link.href)}
                      className="flex w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-muted/70"
                    >
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">{link.title}</span>
                        <span className="block text-xs text-muted-foreground">{link.description}</span>
                      </span>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.14}>
          <Card className="h-full overflow-hidden py-0">
            <CardHeader className="border-b py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Timeline tuyển dụng sẽ hiện tại đây.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full">
                  Trống
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: THEME.motion.base, delay: 0.2 }}
                className="flex size-14 items-center justify-center rounded-3xl bg-muted text-muted-foreground"
              >
                <ClipboardList className="size-6" />
              </motion.div>
              <div className="max-w-sm">
                <h2 className="text-base font-medium text-foreground">Chưa có tín hiệu mới</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Khi có ứng viên mới hoặc lịch phỏng vấn, dòng thời gian sẽ xuất hiện theo từng sự kiện.
                </p>
              </div>
              <Button variant="secondary" onClick={() => navigateWithDelay('/candidates')}>
                Đi tới ứng viên
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateFormat, formatDate } from '@/lib/dayjs';
import type { PostLog } from '@/lib/supabase/types/tables';
import { facebookGroupUrl } from '@/lib/utils/facebook-group-id';
import { cn } from '@/lib/utils';

type PostLogTableProps = {
  logs: PostLog[];
};

const HEAD =
  'h-11 bg-muted/40 py-0 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase';
const CELL = 'px-3 py-3 align-middle';

const COLUMNS = [
  { key: 'status', label: 'Trạng thái', className: 'w-[9%] pl-9 pr-3' },
  { key: 'posted_at', label: 'Thời gian', className: 'w-[13%] px-3 text-center' },
  { key: 'group', label: 'Nhóm', className: 'w-[12%] px-3 text-center' },
  { key: 'category', label: 'Danh mục', className: 'w-[10%] px-3 text-center' },
  { key: 'content', label: 'Nội dung', className: 'w-[26%] px-3' },
  { key: 'image', label: 'Ảnh', className: 'w-[7%] px-3 text-center' },
  { key: 'post', label: 'Bài đăng', className: 'w-[9%] px-3 text-center' },
  { key: 'run_id', label: 'Run ID', className: 'w-[14%] pl-3 pr-7 text-center' },
] as const;

function facebookGroupPostUrl(groupId: string, postId: string) {
  return `${facebookGroupUrl(groupId)}/posts/${encodeURIComponent(postId)}`;
}

function EmptyCell() {
  return <span className="text-muted-foreground/50">—</span>;
}

function StatusBadge({ log }: { log: PostLog }) {
  if (log.ok) {
    return (
      <Badge className="gap-1 bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        <CheckCircle2 data-icon="inline-start" />
        OK
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-1 cursor-default" title={log.error ?? undefined}>
      <XCircle data-icon="inline-start" />
      Lỗi
    </Badge>
  );
}

function GroupChip({ groupId }: { groupId: string }) {
  return (
    <a
      href={facebookGroupUrl(groupId)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-1 truncate font-mono text-xs text-foreground underline-offset-2 hover:text-primary hover:underline"
      title={groupId}
    >
      {groupId}
    </a>
  );
}

function PostChip({ log }: { log: PostLog }) {
  if (!log.ok || !log.post_id) return <EmptyCell />;
  return (
    <a
      href={facebookGroupPostUrl(log.group_id, log.post_id)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-none border border-border bg-background px-2 text-xs font-medium text-foreground transition hover:border-primary/30 hover:bg-accent hover:text-accent-foreground"
    >
      Xem
      <ExternalLink className="size-3 shrink-0 opacity-70" />
    </a>
  );
}

function ContentPreview({ content }: { content: string | null }) {
  if (!content) return <EmptyCell />;
  return (
    <span className="block truncate text-muted-foreground" title={content}>
      {content}
    </span>
  );
}

function ImageThumb({ imageUrl }: { imageUrl: string }) {
  if (!imageUrl) return <EmptyCell />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
    <img
      src={imageUrl}
      alt=""
      className="mx-auto size-9 rounded-none border border-border object-cover"
    />
  );
}

function Center({ children }: { children: ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}

function PostLogMobileCard({ log }: { log: PostLog }) {
  const rows = [
    { label: 'Nhóm', value: <GroupChip groupId={log.group_id} /> },
    { label: 'Nội dung', value: log.content, clamp: true },
    { label: 'Ảnh', value: log.image_url ? <ImageThumb imageUrl={log.image_url} /> : null },
    { label: 'Bài đăng', value: <PostChip log={log} /> },
    { label: 'Run ID', value: log.run_id, mono: true },
    ...(log.ok || !log.error ? [] : [{ label: 'Lỗi', value: log.error, clamp: true, error: true }]),
  ];

  return (
    <article className="min-w-0 overflow-hidden rounded-none border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3 border-b border-border/70 bg-muted/30 px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge log={log} />
            {log.category ? (
              <Badge variant="secondary" className="font-normal" style={{ borderRadius: 9999 }}>
                {log.category}
              </Badge>
            ) : null}
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {formatDate(log.posted_at, DateFormat.DATETIME)}
        </span>
      </div>

      <dl className="grid gap-0 px-1 py-1 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex min-w-0 items-start justify-between gap-3 px-3 py-2.5"
          >
            <dt className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {row.label}
            </dt>
            <dd
              className={cn(
                'min-w-0 text-right text-foreground',
                row.mono && 'font-mono text-xs',
                row.clamp && 'line-clamp-2 break-words',
                row.error && 'text-destructive',
              )}
            >
              {row.value || <EmptyCell />}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function PostLogDesktopTable({ logs }: PostLogTableProps) {
  return (
    <div className="hidden min-w-0 overflow-hidden rounded-none border border-border bg-card shadow-[var(--shadow-soft)] lg:block">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="border-border/80 hover:bg-transparent">
            {COLUMNS.map((col) => (
              <TableHead key={col.key} className={cn(HEAD, col.className)}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="border-border/60 transition-colors hover:bg-accent/40"
            >
              <TableCell className="py-3 pl-9 pr-3 align-middle">
                <StatusBadge log={log} />
              </TableCell>
              <TableCell className={cn(CELL, 'text-center text-muted-foreground tabular-nums')}>
                {formatDate(log.posted_at, DateFormat.DATETIME)}
              </TableCell>
              <TableCell className={cn(CELL, 'text-center')}>
                <GroupChip groupId={log.group_id} />
              </TableCell>
              <TableCell className={cn(CELL, 'text-center')}>
                {log.category ? (
                  <Center>
                    <Badge
                      variant="secondary"
                      className="max-w-full truncate font-normal"
                      style={{ borderRadius: 9999 }}
                    >
                      {log.category}
                    </Badge>
                  </Center>
                ) : (
                  <EmptyCell />
                )}
              </TableCell>
              <TableCell className={CELL}>
                <ContentPreview content={log.content} />
              </TableCell>
              <TableCell className={cn(CELL, 'text-center')}>
                <Center>
                  <ImageThumb imageUrl={log.image_url} />
                </Center>
              </TableCell>
              <TableCell className={cn(CELL, 'text-center')}>
                <Center>
                  <PostChip log={log} />
                </Center>
              </TableCell>
              <TableCell className="truncate py-3 pr-7 pl-3 text-center align-middle font-mono text-xs text-muted-foreground">
                {log.run_id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PostLogTable({ logs }: PostLogTableProps) {
  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="grid gap-3 lg:hidden">
        {logs.map((log) => (
          <PostLogMobileCard key={log.id} log={log} />
        ))}
      </div>
      <PostLogDesktopTable logs={logs} />
    </div>
  );
}

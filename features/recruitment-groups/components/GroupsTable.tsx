'use client';

import type { ReactNode } from 'react';
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Rating } from '@/components/ui/rating';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUpdateRecruitmentGroup } from '@/features/recruitment-groups/hooks';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';
import { cn } from '@/lib/utils';

type GroupsTableProps = {
  groups: RecruitmentGroup[];
  onEdit: (group: RecruitmentGroup) => void;
  onDelete: (group: RecruitmentGroup) => void;
};

type GroupHandlers = {
  onEdit: (group: RecruitmentGroup) => void;
  onDelete: (group: RecruitmentGroup) => void;
  onRateChange: (group: RecruitmentGroup, rate: number) => void;
};

const HEAD =
  'h-11 bg-muted/40 py-0 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase';
const CELL = 'px-3 py-3 align-middle';

const COLUMNS = [
  { key: 'name', label: 'Tên nhóm', className: 'w-[34%] pl-9 pr-3' },
  { key: 'category', label: 'Danh mục', className: 'w-[12%] px-3' },
  { key: 'group_id', label: 'Group ID', className: 'w-[12%] px-3 text-center' },
  { key: 'rate', label: 'Đánh giá', className: 'w-[12%] px-3 text-center' },
  { key: 'link', label: 'Link', className: 'w-[7%] px-3 text-center' },
  { key: 'note', label: 'Ghi chú', className: 'w-[11%] px-3' },
  { key: 'created_at', label: 'Ngày tạo', className: 'w-[8%] px-3 text-center' },
  { key: 'actions', label: '', className: 'w-[6%] pl-2 pr-7 text-center' },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function facebookGroupUrl(groupId: string) {
  return `https://www.facebook.com/groups/${encodeURIComponent(groupId)}`;
}

function EmptyCell() {
  return <span className="text-muted-foreground/50">—</span>;
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return <EmptyCell />;
  return (
    <Badge variant="secondary" className="max-w-full truncate rounded-md font-normal">
      {category}
    </Badge>
  );
}

function RateCell({
  group,
  onRateChange,
}: {
  group: RecruitmentGroup;
  onRateChange: GroupHandlers['onRateChange'];
}) {
  return (
    <Rating
      rating={group.rate ?? 0}
      size="sm"
      editable
      onRatingChange={(rate) => {
        if (rate !== group.rate) onRateChange(group, rate);
      }}
    />
  );
}

function LinkChip({ groupId }: { groupId: string | null }) {
  if (!groupId) return <EmptyCell />;
  return (
    <a
      href={facebookGroupUrl(groupId)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition hover:border-primary/30 hover:bg-accent hover:text-accent-foreground"
    >
      Mở
      <ExternalLink className="size-3 shrink-0 opacity-70" />
    </a>
  );
}

function GroupActions({ group, onEdit, onDelete }: Omit<GroupHandlers, 'onRateChange'> & {
  group: RecruitmentGroup;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-muted-foreground hover:text-foreground"
          aria-label="Thao tác"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onEdit(group)}>
          <Pencil />
          Sửa
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(group)}>
          <Trash2 />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Center({ children }: { children: ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}

function GroupMobileCard({ group, onEdit, onDelete, onRateChange }: GroupHandlers & {
  group: RecruitmentGroup;
}) {
  const rows = [
    { label: 'Group ID', value: group.group_id, mono: true },
    { label: 'Link', value: group.group_id ? <LinkChip groupId={group.group_id} /> : null },
    { label: 'Ghi chú', value: group.note, clamp: true },
    { label: 'Ngày tạo', value: formatDate(group.created_at) },
  ];

  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3 border-b border-border/70 bg-muted/30 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-[15px] font-semibold tracking-tight text-foreground">
            {group.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {group.category ? (
              <Badge variant="secondary" className="rounded-md font-normal">
                {group.category}
              </Badge>
            ) : null}
            <RateCell group={group} onRateChange={onRateChange} />
          </div>
        </div>
        <GroupActions group={group} onEdit={onEdit} onDelete={onDelete} />
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

function GroupsDesktopTable({ groups, onEdit, onDelete, onRateChange }: GroupsTableProps & {
  onRateChange: GroupHandlers['onRateChange'];
}) {
  return (
    <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] lg:block">
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
          {groups.map((group) => (
            <TableRow
              key={group.id}
              className="border-border/60 transition-colors hover:bg-accent/40"
            >
              <TableCell className="whitespace-normal py-3 pl-9 pr-3 align-middle font-medium leading-snug text-foreground">
                {group.name}
              </TableCell>
              <TableCell className={CELL}>
                <CategoryBadge category={group.category} />
              </TableCell>
              <TableCell className={cn(CELL, 'truncate text-center font-mono text-xs text-muted-foreground')}>
                {group.group_id || <EmptyCell />}
              </TableCell>
              <TableCell className={cn(CELL, 'text-center')}>
                <Center>
                  <RateCell group={group} onRateChange={onRateChange} />
                </Center>
              </TableCell>
              <TableCell className={cn(CELL, 'text-center')}>
                <Center>
                  <LinkChip groupId={group.group_id} />
                </Center>
              </TableCell>
              <TableCell className={cn(CELL, 'truncate text-muted-foreground')}>
                {group.note || <EmptyCell />}
              </TableCell>
              <TableCell className={cn(CELL, 'text-center text-muted-foreground tabular-nums')}>
                {formatDate(group.created_at)}
              </TableCell>
              <TableCell className="py-3 pr-7 pl-2 text-center align-middle">
                <Center>
                  <GroupActions group={group} onEdit={onEdit} onDelete={onDelete} />
                </Center>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function GroupsTable({ groups, onEdit, onDelete }: GroupsTableProps) {
  const updateMutation = useUpdateRecruitmentGroup();

  const handlers: GroupHandlers = {
    onEdit,
    onDelete,
    onRateChange: (group, rate) => {
      updateMutation.mutate({ id: group.id, input: { rate }, silent: true });
    },
  };

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div className="grid gap-3 lg:hidden">
        {groups.map((group) => (
          <GroupMobileCard key={group.id} group={group} {...handlers} />
        ))}
      </div>
      <GroupsDesktopTable groups={groups} {...handlers} />
    </div>
  );
}

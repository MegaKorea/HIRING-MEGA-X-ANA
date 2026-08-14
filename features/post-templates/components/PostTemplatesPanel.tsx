'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Pencil, Plus } from 'lucide-react';
import { EmptyState, LoadingState, Pagination } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { POST_TEMPLATES_PAGE_SIZE } from '@/features/post-templates/api';
import { usePostTemplates, useUpdatePostTemplate } from '@/features/post-templates/hooks';
import { DeleteTemplateConfirm } from '@/features/post-templates/components/DeleteTemplateConfirm';
import { DateFormat, formatDate } from '@/lib/dayjs';
import { getPlainTextFromHtml } from '@/lib/utils/html-content';
import { cn, getErrorMessage } from '@/lib/utils';

const ALL_VALUE = '__all__';

const HEAD =
  'h-11 bg-muted/40 py-0 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase';
const CELL = 'px-3 py-3 align-middle';

const COLUMNS = [
  { key: 'category', label: 'Danh mục', className: 'w-[13%] pr-3 pl-6' },
  { key: 'content', label: 'Nội dung', className: 'w-[38%] px-3' },
  { key: 'image', label: 'Ảnh', className: 'w-[8%] px-3 text-center' },
  { key: 'status', label: 'Trạng thái', className: 'w-[11%] px-3' },
  { key: 'last_posted_at', label: 'Đăng gần nhất', className: 'w-[14%] px-3' },
  { key: 'actions', label: '', className: 'w-[16%] pr-6 pl-3' },
] as const;

export function PostTemplatesPanel() {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = usePostTemplates(page, category);
  const updateMutation = useUpdatePostTemplate();

  const templates = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;
  const newHref = category
    ? `/posts/content/new?category=${encodeURIComponent(category)}`
    : '/posts/content/new';

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Select
          value={category ?? ALL_VALUE}
          onValueChange={(value) => {
            setCategory(value === ALL_VALUE ? null : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full bg-background sm:w-44">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContentPopper>
            <SelectItem value={ALL_VALUE}>Tất cả danh mục</SelectItem>
            {RECRUITMENT_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContentPopper>
        </Select>
        <Button asChild>
          <Link href={newHref}>
            <Plus data-icon="inline-start" />
            Thêm content
          </Link>
        </Button>
      </div>

      {isLoading ? <LoadingState tip="Đang tải content..." /> : null}

      {!isLoading && isError ? (
        <EmptyState
          image={<FileText className="size-6" />}
          title="Không tải được content"
          description={getErrorMessage(error, 'Kiểm tra bảng post_template đã tạo chưa.')}
          actionLabel="Thử lại"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && templates.length === 0 ? (
        <EmptyState
          image={<FileText className="size-6" />}
          title="Chưa có content"
          description="Tạo content đầu tiên để dùng khi soạn bài đăng."
          actionLabel="Thêm content"
          onAction={() => {
            router.push(newHref);
          }}
        />
      ) : null}

      {!isLoading && !isError && templates.length > 0 ? (
        <div>
          <div className="min-w-0 overflow-hidden rounded-none border border-border bg-card shadow-[var(--shadow-soft)]">
            <Table className="min-w-[880px] table-fixed" containerClassName="overflow-x-auto">
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
                {templates.map((template) => {
                  const preview = getPlainTextFromHtml(template.content);
                  return (
                    <TableRow
                      key={template.id}
                      className="border-border/60 transition-colors hover:bg-accent/40"
                    >
                      <TableCell className="py-3 pr-3 pl-6 align-middle">
                        <Badge
                          variant="secondary"
                          className="max-w-full truncate font-normal"
                          style={{ borderRadius: 9999 }}
                        >
                          {template.category}
                        </Badge>
                      </TableCell>
                      <TableCell className={CELL}>
                        <span
                          className="line-clamp-2 wrap-anywhere text-muted-foreground"
                          title={preview}
                        >
                          {preview || '(Không có chữ)'}
                        </span>
                      </TableCell>
                      <TableCell className={cn(CELL, 'text-center')}>
                        {template.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
                          <img
                            src={template.image_url}
                            alt=""
                            className="mx-auto size-9 rounded-none border border-border object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className={CELL}>
                        <Badge variant={template.is_active ? 'default' : 'outline'}>
                          {template.is_active ? 'Đang bật' : 'Tạm tắt'}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(CELL, 'text-muted-foreground tabular-nums')}>
                        {formatDate(template.last_posted_at, DateFormat.DATETIME) ||
                          'Chưa từng đăng'}
                      </TableCell>
                      <TableCell className="py-3 pr-6 pl-3 align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            size="sm"
                            title={template.is_active ? 'Tắt' : 'Bật'}
                            checked={template.is_active}
                            disabled={updateMutation.isPending}
                            onCheckedChange={(checked) =>
                              updateMutation.mutate({
                                id: template.id,
                                input: { is_active: checked },
                              })
                            }
                          />
                          <Button asChild variant="outline" size="icon-sm" title="Sửa">
                            <Link href={`/posts/content/${template.id}/edit`}>
                              <Pencil />
                            </Link>
                          </Button>
                          <DeleteTemplateConfirm
                            template={template}
                            disabled={updateMutation.isPending}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={POST_TEMPLATES_PAGE_SIZE}
            unitLabel="content"
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Pencil, Plus } from 'lucide-react';
import { EmptyState, ExpandableText, LoadingState, Pagination } from '@/components/common';
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
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { POST_TEMPLATES_PAGE_SIZE } from '@/features/post-templates/api';
import { usePostTemplates, useUpdatePostTemplate } from '@/features/post-templates/hooks';
import { DeleteTemplateConfirm } from '@/features/post-templates/components/DeleteTemplateConfirm';
import { getPlainTextFromHtml } from '@/lib/utils/html-content';
import { getErrorMessage } from '@/lib/utils';

const ALL_VALUE = '__all__';

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
          <div className="grid gap-3">
            {templates.map((template) => {
              const preview = getPlainTextFromHtml(template.content);
              return (
                <article
                  key={template.id}
                  className="grid gap-3 rounded-none border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge variant={template.is_active ? 'default' : 'outline'}>
                        {template.is_active ? 'Đang bật' : 'Tạm tắt'}
                      </Badge>
                      {template.last_posted_at ? (
                        <span className="text-xs text-muted-foreground">
                          Đăng gần nhất: {new Date(template.last_posted_at).toLocaleString('vi-VN')}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Chưa từng đăng</span>
                      )}
                    </div>
                    <ExpandableText text={preview || '(Không có chữ)'} />
                    {template.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
                      <img
                        src={template.image_url}
                        alt=""
                        className="mt-1 h-20 w-20 rounded-none border border-border object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-row sm:justify-end sm:self-start">
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
                </article>
              );
            })}
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

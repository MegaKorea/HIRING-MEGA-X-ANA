'use client';

import { useState } from 'react';
import { FileText, ImageIcon } from 'lucide-react';
import { EmptyState, LoadingState } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePostTemplates } from '@/features/post-templates/hooks';
import type { PostTemplate } from '@/lib/supabase/types/tables';
import { getPlainTextFromHtml } from '@/lib/utils/html-content';

type TemplatePickerDialogProps = {
  category: string | null;
  disabled?: boolean;
  onSelect: (template: PostTemplate) => void;
};

export function TemplatePickerDialog({
  category,
  disabled,
  onSelect,
}: TemplatePickerDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = usePostTemplates(1, category, true, open && !!category);
  const templates = data?.data ?? [];

  function handlePick(template: PostTemplate) {
    onSelect(template);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={disabled || !category}>
          <FileText data-icon="inline-start" />
          Chọn từ Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chọn content có sẵn</DialogTitle>
          <DialogDescription>
            {category
              ? `Nội dung + ảnh sẽ điền vào form, bạn vẫn sửa được trước khi đăng.`
              : 'Chọn danh mục trước khi chọn content.'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] min-w-0 overflow-y-auto">
          {isLoading ? <LoadingState tip="Đang tải content..." /> : null}

          {!isLoading && isError ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Không tải được content.
            </p>
          ) : null}

          {!isLoading && !isError && templates.length === 0 ? (
            <EmptyState
              image={<FileText className="size-6" />}
              title="Chưa có content"
              description={
                category
                  ? `Danh mục ${category} chưa có content nào đang bật.`
                  : 'Chưa có content nào đang bật.'
              }
            />
          ) : null}

          {!isLoading && !isError && templates.length > 0 ? (
            <div className="grid gap-2">
              {templates.map((template) => {
                const preview = getPlainTextFromHtml(template.content);
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handlePick(template)}
                    className="grid min-w-0 gap-2 rounded-xl border border-border p-3 text-left transition hover:border-primary/40 hover:bg-accent/40"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      {template.image_url ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ImageIcon className="size-3" /> Có ảnh
                        </span>
                      ) : null}
                    </div>
                    <p className="line-clamp-3 min-w-0 text-wrap-anywhere text-sm text-foreground">
                      {preview || '(Không có chữ)'}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RecruitmentCategoryOption } from '@/features/group-posts/api';
import { ContentEditor } from '@/features/group-posts/components/ContentEditor';
import { ImagePicker } from '@/features/group-posts/components/ImagePicker';
import { PostSubmitButton } from '@/features/group-posts/components/PostSubmitButton';
import { TemplatePickerDialog } from '@/features/group-posts/components/TemplatePickerDialog';
import type { PostTemplate } from '@/lib/supabase/types/tables';

type ComposePanelProps = {
  categories: RecruitmentCategoryOption[];
  categoriesLoading?: boolean;
  category: string | null;
  content: string;
  previewUrl: string | null;
  groupIdsLoading: boolean;
  groupIdsError?: boolean;
  groupCount: number;
  groupHint?: string | null;
  submitting: boolean;
  canSubmit: boolean;
  randomContent: boolean;
  templateCount: number;
  templatesLoading: boolean;
  onRandomContentChange: (randomContent: boolean) => void;
  onCategoryChange: (category: string) => void;
  onContentChange: (content: string) => void;
  onImageChange: (file: File | null) => void;
  onClearImage: () => void;
  onSelectTemplate: (template: PostTemplate) => void;
};

export function ComposePanel({
  categories,
  categoriesLoading,
  category,
  content,
  previewUrl,
  groupIdsLoading,
  groupIdsError,
  groupCount,
  groupHint,
  submitting,
  canSubmit,
  randomContent,
  templateCount,
  templatesLoading,
  onRandomContentChange,
  onCategoryChange,
  onContentChange,
  onImageChange,
  onClearImage,
  onSelectTemplate,
}: ComposePanelProps) {
  return (
    <section className="grid min-w-0 gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:gap-5 sm:p-5 md:p-6 lg:rounded-none lg:border-0 lg:border-r lg:border-border lg:p-6 lg:shadow-none xl:p-8">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">
          Chọn đúng thẻ danh mục đã gắn trên Danh sách nhóm (vd: HR).
        </p>
      </div>

      <div className="grid min-w-0 gap-2">
        <Label htmlFor="post-category">
          Danh mục <span className="text-destructive">*</span>
        </Label>
        <Select
          value={category ?? undefined}
          disabled={submitting || categoriesLoading}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger id="post-category" className="w-full max-w-full bg-background">
            <SelectValue placeholder="Chọn thẻ danh mục đã có trên nhóm" />
          </SelectTrigger>
          <SelectContentPopper className="w-[var(--radix-select-trigger-width)]">
            {categories.length === 0 ? (
              <SelectItem value="__empty" disabled>
                Chưa có thẻ danh mục trên Danh sách nhóm
              </SelectItem>
            ) : (
              categories.map((item) => (
                <SelectItem key={item.category} value={item.category}>
                  {item.category}
                </SelectItem>
              ))
            )}
          </SelectContentPopper>
        </Select>
        {category ? (
          <p
            className={
              groupIdsError || (groupCount === 0 && !groupIdsLoading)
                ? 'text-xs text-destructive'
                : 'text-xs text-muted-foreground'
            }
          >
            {groupIdsLoading
              ? 'Đang tải danh sách nhóm...'
              : groupIdsError
                ? 'Không tải được Group ID. Thử lại hoặc kiểm tra cột is_active trên DB.'
                : groupCount > 0
                  ? `Sẽ đăng tới ${groupCount} nhóm thuộc danh mục này.`
                  : (groupHint ?? 'Danh mục này chưa có Group ID để đăng.')}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Danh mục lấy theo nhóm đã gắn ở menu Danh sách nhóm.
          </p>
        )}
      </div>

      <div className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-border bg-background/60 p-3">
        <div className="min-w-0 grid gap-0.5">
          <Label htmlFor="random-content" className="cursor-pointer">
            Random content tự động
          </Label>
          <p className="text-xs text-muted-foreground">
            {randomContent
              ? templatesLoading
                ? 'Đang đếm content của danh mục...'
                : templateCount > 0
                  ? `Mỗi nhóm nhận 1 content ngẫu nhiên (kèm ảnh) trong ${templateCount} content đang bật.`
                  : 'Danh mục này chưa có content nào đang bật — bật content ở menu Content trước.'
              : 'Bật để không phải soạn nội dung — n8n bốc ngẫu nhiên từ Content của danh mục.'}
          </p>
        </div>
        <Switch
          id="random-content"
          checked={randomContent}
          disabled={submitting}
          onCheckedChange={onRandomContentChange}
        />
      </div>

      {randomContent ? null : (
        <>
          <div className="grid min-w-0 gap-2">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <Label htmlFor="post-content">
                Nội dung <span className="text-destructive">*</span>
              </Label>
              <TemplatePickerDialog
                category={category}
                disabled={submitting}
                onSelect={onSelectTemplate}
              />
            </div>
            <ContentEditor
              id="post-content"
              value={content}
              onChange={onContentChange}
              disabled={submitting}
              placeholder="Nhập nội dung bài đăng..."
            />
          </div>

          <ImagePicker
            previewUrl={previewUrl}
            disabled={submitting}
            onChange={onImageChange}
            onClear={onClearImage}
          />
        </>
      )}

      <div className="hidden justify-end pt-1 lg:flex">
        <PostSubmitButton submitting={submitting} disabled={!canSubmit} />
      </div>
    </section>
  );
}

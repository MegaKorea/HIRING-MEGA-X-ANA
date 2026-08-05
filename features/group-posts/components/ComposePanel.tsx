'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImagePicker } from '@/features/group-posts/components/ImagePicker';
import { PostSubmitButton } from '@/features/group-posts/components/PostSubmitButton';

type ComposePanelProps = {
  categories: string[];
  categoriesLoading: boolean;
  category: string | null;
  content: string;
  previewUrl: string | null;
  groupIdsLoading: boolean;
  groupCount: number;
  submitting: boolean;
  canSubmit: boolean;
  onCategoryChange: (category: string) => void;
  onContentChange: (content: string) => void;
  onImageChange: (file: File | null) => void;
  onClearImage: () => void;
};

export function ComposePanel({
  categories,
  categoriesLoading,
  category,
  content,
  previewUrl,
  groupIdsLoading,
  groupCount,
  submitting,
  canSubmit,
  onCategoryChange,
  onContentChange,
  onImageChange,
  onClearImage,
}: ComposePanelProps) {
  return (
    <section className="grid min-w-0 gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:gap-5 sm:p-5 md:p-6 lg:rounded-none lg:border-0 lg:border-r lg:border-border lg:p-6 lg:shadow-none xl:p-8">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-foreground">Soạn bài</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Nội dung, danh mục và ảnh đăng lên nhóm.
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
            <SelectValue placeholder="Chọn danh mục nhóm" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            sideOffset={6}
            avoidCollisions={false}
            className="max-h-72 w-[var(--radix-select-trigger-width)]"
          >
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {category ? (
          <p className="text-xs text-muted-foreground">
            {groupIdsLoading
              ? 'Đang tải danh sách nhóm...'
              : groupCount > 0
                ? `Sẽ đăng tới ${groupCount} nhóm thuộc danh mục này.`
                : 'Danh mục này chưa có Group ID.'}
          </p>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-2">
        <Label htmlFor="post-content">
          Nội dung <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="post-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Nhập nội dung bài đăng..."
          rows={10}
          className="min-h-40 break-words sm:min-h-56 lg:min-h-72 [overflow-wrap:anywhere]"
          disabled={submitting}
          required
        />
      </div>

      <ImagePicker
        previewUrl={previewUrl}
        disabled={submitting}
        onChange={onImageChange}
        onClear={onClearImage}
      />

      <div className="hidden justify-end pt-1 lg:flex">
        <PostSubmitButton submitting={submitting} disabled={!canSubmit} />
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { ContentEditor } from '@/features/group-posts/components/ContentEditor';
import { ImagePicker } from '@/features/group-posts/components/ImagePicker';
import {
  useCreatePostTemplate,
  useUpdatePostTemplate,
} from '@/features/post-templates/hooks';
import type { PostTemplate } from '@/lib/supabase/types/tables';
import { isHtmlContentEmpty } from '@/lib/utils/html-content';

type FormState = {
  category: string;
  content: string;
  is_active: boolean;
  image: File | null;
  previewUrl: string | null;
  clearImage: boolean;
};

type TemplateFormProps = {
  template?: PostTemplate | null;
  defaultCategory?: string | null;
};

export function TemplateForm({ template, defaultCategory }: TemplateFormProps) {
  const router = useRouter();
  const isEdit = !!template;
  const createMutation = useCreatePostTemplate();
  const updateMutation = useUpdatePostTemplate();
  const submitting = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<FormState>(() => ({
    category: template?.category ?? defaultCategory ?? RECRUITMENT_CATEGORIES[0],
    content: template?.content ?? '',
    is_active: template?.is_active ?? true,
    image: null,
    previewUrl: template?.image_url || null,
    clearImage: false,
  }));

  useEffect(() => {
    return () => {
      if (form.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(form.previewUrl);
    };
  }, [form.previewUrl]);

  const canSubmit = !!form.category && !isHtmlContentEmpty(form.content) && !submitting;

  function goBack() {
    router.push('/posts/content');
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    const onSuccess = () => router.push('/posts/content');

    if (isEdit && template) {
      updateMutation.mutate(
        {
          id: template.id,
          input: {
            category: form.category as (typeof RECRUITMENT_CATEGORIES)[number],
            content: form.content,
            is_active: form.is_active,
            image: form.image,
            clear_image: form.clearImage,
          },
        },
        { onSuccess },
      );
    } else {
      createMutation.mutate(
        {
          category: form.category as (typeof RECRUITMENT_CATEGORIES)[number],
          content: form.content,
          image_url: '',
          is_active: form.is_active,
          image: form.image,
        },
        { onSuccess },
      );
    }
  }

  return (
    <form
      className="grid w-full min-w-0 gap-6 rounded-none border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6"
      onSubmit={handleSubmit}
    >
      {/* Meta */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="grid w-full min-w-0 gap-2 sm:w-44">
          <Label htmlFor="template-category">Danh mục</Label>
          <Select
            value={form.category || RECRUITMENT_CATEGORIES[0]}
            disabled={submitting}
            onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger
              id="template-category"
              className="h-10 w-full min-w-0 bg-background data-[size=default]:h-10 md:h-9 md:data-[size=default]:h-9"
            >
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContentPopper>
              {RECRUITMENT_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContentPopper>
          </Select>
        </div>

        <div className="flex h-10 w-fit shrink-0 items-center gap-2.5 rounded-none border border-border bg-muted/30 px-3 md:h-9">
          <Label htmlFor="template-active" className="cursor-pointer text-sm font-medium">
            Đang bật
          </Label>
          <Switch
            id="template-active"
            checked={form.is_active}
            disabled={submitting}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
          />
        </div>
      </div>

      {/* Nội dung + ảnh */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid min-w-0 gap-2">
          <Label>Nội dung</Label>
          <ContentEditor
            value={form.content}
            onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            disabled={submitting}
          />
        </div>

        <div className="min-w-0 lg:sticky lg:top-4">
          <ImagePicker
            previewUrl={form.previewUrl}
            disabled={submitting}
            onChange={(file) => {
              setForm((prev) => {
                if (prev.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.previewUrl);
                return {
                  ...prev,
                  image: file,
                  previewUrl: file ? URL.createObjectURL(file) : null,
                  clearImage: !file,
                };
              });
            }}
            onClear={() => {
              setForm((prev) => {
                if (prev.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(prev.previewUrl);
                return { ...prev, image: null, previewUrl: null, clearImage: true };
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full sm:h-9 sm:w-auto"
          disabled={submitting}
          onClick={goBack}
        >
          Hủy
        </Button>
        <Button type="submit" className="h-11 w-full sm:h-9 sm:w-auto" disabled={!canSubmit}>
          {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo content'}
        </Button>
      </div>
    </form>
  );
}

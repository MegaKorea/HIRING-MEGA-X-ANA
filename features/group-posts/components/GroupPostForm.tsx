'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ComposePanel } from '@/features/group-posts/components/ComposePanel';
import { PostSubmitButton } from '@/features/group-posts/components/PostSubmitButton';
import { PreviewPanel } from '@/features/group-posts/components/PreviewPanel';
import {
  useCreateGroupPost,
  useGroupIdsByCategory,
  useRecruitmentCategories,
} from '@/features/group-posts/hooks';
import { useGroupPostDraftStore } from '@/features/group-posts/store';
import { usePostTemplates } from '@/features/post-templates/hooks';
import { describeGroupAvailability } from '@/lib/utils/group-availability';
import { isHtmlContentEmpty } from '@/lib/utils/html-content';

export function GroupPostForm() {
  const category = useGroupPostDraftStore((s) => s.category);
  const content = useGroupPostDraftStore((s) => s.content);
  const image = useGroupPostDraftStore((s) => s.image);
  const imageUrl = useGroupPostDraftStore((s) => s.imageUrl);
  const previewUrl = useGroupPostDraftStore((s) => s.previewUrl);
  const randomContent = useGroupPostDraftStore((s) => s.randomContent);
  const setCategory = useGroupPostDraftStore((s) => s.setCategory);
  const setContent = useGroupPostDraftStore((s) => s.setContent);
  const setRandomContent = useGroupPostDraftStore((s) => s.setRandomContent);
  const setImage = useGroupPostDraftStore((s) => s.setImage);
  const applyTemplate = useGroupPostDraftStore((s) => s.applyTemplate);
  const clearImage = useGroupPostDraftStore((s) => s.clearImage);
  const clearDraft = useGroupPostDraftStore((s) => s.clearDraft);

  const categoriesQuery = useRecruitmentCategories();
  const groupIdsQuery = useGroupIdsByCategory(category);
  const createMutation = useCreateGroupPost();
  const templatesQuery = usePostTemplates(1, category, true, randomContent && !!category);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const categories = categoriesQuery.data?.data;
  const categoryOptions = categories ?? [];

  useEffect(() => {
    if (category) return;
    if (!categories || categories.length === 0) return;
    const preferred =
      categories.find((item) => item.ready_groups > 0) ??
      categories.find((item) => item.total_groups > 0) ??
      categories[0];
    if (preferred) setCategory(preferred.category);
  }, [category, categories, setCategory]);

  const groupIds = groupIdsQuery.data?.data ?? [];
  const groupMeta = groupIdsQuery.data?.meta;
  const submitting = createMutation.isPending;
  const templateCount = templatesQuery.data?.meta.total ?? 0;
  // Random mode không có draft để xem trước — lấy tạm content đầu tiên làm mẫu.
  const sampleTemplate = randomContent ? templatesQuery.data?.data[0] : undefined;
  // Random mode: n8n lấy content từ post_template nên form không cần nội dung.
  const hasContent = randomContent
    ? templateCount > 0 && !templatesQuery.isLoading
    : !isHtmlContentEmpty(content);
  const canSubmit =
    !submitting &&
    hasContent &&
    !!category &&
    groupIds.length > 0 &&
    !groupIdsQuery.isLoading &&
    !groupIdsQuery.isError;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  }

  function handleConfirmPost() {
    if (!category || !hasContent) return;

    createMutation.mutate(
      { content: content.trim(), category, image, imageUrl, randomContent },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          clearDraft();
        },
      },
    );
  }

  return (
    <>
      <form
        className="grid min-w-0 w-full gap-4 lg:grid-cols-2 lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:shadow-[var(--shadow-soft)]"
        onSubmit={handleSubmit}
      >
        <ComposePanel
          categories={categoryOptions}
          categoriesLoading={categoriesQuery.isLoading}
          category={category}
          content={content}
          previewUrl={previewUrl}
          groupIdsLoading={groupIdsQuery.isLoading}
          groupIdsError={groupIdsQuery.isError}
          groupCount={groupIds.length}
          groupHint={describeGroupAvailability(groupMeta)}
          submitting={submitting}
          canSubmit={canSubmit}
          randomContent={randomContent}
          templateCount={templateCount}
          templatesLoading={templatesQuery.isLoading}
          onRandomContentChange={setRandomContent}
          onCategoryChange={setCategory}
          onContentChange={setContent}
          onImageChange={setImage}
          onClearImage={clearImage}
          onSelectTemplate={applyTemplate}
        />

        <PreviewPanel
          content={sampleTemplate?.content ?? content}
          category={category}
          previewUrl={sampleTemplate?.image_url || previewUrl}
          groupCount={groupIds.length}
          note={
            randomContent
              ? `Ví dụ 1 trong ${templateCount} content — mỗi nhóm nhận một content khác nhau.`
              : undefined
          }
        />

        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-5 lg:hidden">
          <PostSubmitButton submitting={submitting} disabled={!canSubmit} fullWidth />
        </div>
      </form>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!submitting) setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng bài?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài sẽ được gửi tới{' '}
              <span className="font-medium text-foreground">{groupIds.length} nhóm</span>
              {category ? (
                <>
                  {' '}
                  thuộc danh mục{' '}
                  <span className="font-medium text-foreground">{category}</span>
                </>
              ) : null}
              {randomContent
                ? ` — mỗi nhóm 1 content ngẫu nhiên trong ${templateCount} content đang bật`
                : image
                  ? ' (có ảnh đính kèm)'
                  : ''}
              . Bạn có chắc muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={(event) => {
                event.preventDefault();
                handleConfirmPost();
              }}
            >
              {submitting ? 'Đang gửi...' : 'Xác nhận đăng'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

'use client';

import { useState, type FormEvent } from 'react';
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

export function GroupPostForm() {
  const draft = useGroupPostDraftStore();
  const categoriesQuery = useRecruitmentCategories();
  const groupIdsQuery = useGroupIdsByCategory(draft.category);
  const createMutation = useCreateGroupPost();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const categories = categoriesQuery.data ?? [];
  const groupIds = groupIdsQuery.data ?? [];
  const submitting = createMutation.isPending;
  const trimmedContent = draft.content.trim();
  const canSubmit =
    !submitting &&
    !!trimmedContent &&
    !!draft.category &&
    groupIds.length > 0 &&
    !groupIdsQuery.isLoading;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  }

  async function handleConfirmPost() {
    if (!draft.category || !trimmedContent) return;

    await createMutation.mutateAsync({
      content: trimmedContent,
      category: draft.category,
      image: draft.image,
    });

    setConfirmOpen(false);
    draft.clearDraft();
  }

  return (
    <>
      <form
        className="grid min-w-0 w-full gap-4 lg:grid-cols-2 lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:shadow-[var(--shadow-soft)]"
        onSubmit={handleSubmit}
      >
        <ComposePanel
          categories={categories}
          categoriesLoading={categoriesQuery.isLoading}
          category={draft.category}
          content={draft.content}
          previewUrl={draft.previewUrl}
          groupIdsLoading={groupIdsQuery.isLoading}
          groupCount={groupIds.length}
          submitting={submitting}
          canSubmit={canSubmit}
          onCategoryChange={draft.setCategory}
          onContentChange={draft.setContent}
          onImageChange={draft.setImage}
          onClearImage={draft.clearImage}
        />

        <PreviewPanel
          content={draft.content}
          category={draft.category}
          previewUrl={draft.previewUrl}
          groupCount={groupIds.length}
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
              {draft.category ? (
                <>
                  {' '}
                  thuộc danh mục{' '}
                  <span className="font-medium text-foreground">{draft.category}</span>
                </>
              ) : null}
              {draft.image ? ' (có ảnh đính kèm)' : ''}. Bạn có chắc muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmPost();
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

'use client';

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
import { useDeleteRecruitmentGroup } from '@/features/recruitment-groups/hooks';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';

type DeleteGroupDialogProps = {
  group: RecruitmentGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteGroupDialog({ group, open, onOpenChange }: DeleteGroupDialogProps) {
  const deleteMutation = useDeleteRecruitmentGroup();

  async function handleDelete() {
    if (!group) return;
    await deleteMutation.mutateAsync(group.id);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhóm?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn sắp xóa nhóm <span className="font-medium text-foreground">{group?.name}</span>.
            Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

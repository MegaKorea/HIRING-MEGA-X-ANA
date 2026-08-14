'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeletePostTemplate } from '@/features/post-templates/hooks';
import type { PostTemplate } from '@/lib/supabase/types/tables';

type DeleteTemplateConfirmProps = {
  template: PostTemplate;
  disabled?: boolean;
};

export function DeleteTemplateConfirm({ template, disabled }: DeleteTemplateConfirmProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeletePostTemplate();

  function handleDelete() {
    mutate(template.id, { onSuccess: () => setOpen(false) });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          title="Xóa"
          disabled={disabled || isPending}
        >
          <Trash2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="left"
        sideOffset={8}
        className="w-52 rounded-none p-3"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <p className="text-sm text-foreground">Bạn chắc chắn muốn xóa?</p>
        <div className="mt-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

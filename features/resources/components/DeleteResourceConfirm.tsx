'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ResourceImage } from '@/features/resources/api';
import { useDeleteResourceImage } from '@/features/resources/hooks';

export function DeleteResourceConfirm({ image }: { image: ResourceImage }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteResourceImage();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="destructive" size="icon-sm" title="Xóa">
          <Trash2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-none p-3"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <p className="text-sm text-foreground">Xóa ảnh này?</p>
        <div className="mt-3 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => mutate(image.path, { onSuccess: () => setOpen(false) })}
          >
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteResourceConfirm } from '@/features/resources/components/DeleteResourceConfirm';
import { ImagePreviewDialog } from '@/features/resources/components/ImagePreviewDialog';
import type { ResourceImage } from '@/features/resources/api';
import { useDeleteResourceImages } from '@/features/resources/hooks';
import { DateFormat, formatDate } from '@/lib/dayjs';

type ResourceGridProps = {
  images: ResourceImage[];
  onEdit: (image: ResourceImage) => void;
};

export function ResourceGrid({ images, onEdit }: ResourceGridProps) {
  const [previewing, setPreviewing] = useState<ResourceImage | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);
  const bulkDeleteMutation = useDeleteResourceImages();

  // Reset selection whenever the image list changes (folder switch, refetch after
  // delete, …) — adjusting state during render instead of an effect, per React docs.
  const [prevImages, setPrevImages] = useState(images);
  if (images !== prevImages) {
    setPrevImages(images);
    setSelected(new Set());
  }

  function toggle(path: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  const allSelected = images.length > 0 && selected.size === images.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="rounded-none border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2.5 border-b border-border px-2.5 py-1.5">
        <Checkbox
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={(checked) =>
            setSelected(checked ? new Set(images.map((i) => i.path)) : new Set())
          }
          aria-label="Chọn tất cả"
        />
        {selected.size > 0 ? (
          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm text-foreground">Đã chọn {selected.size} ảnh</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              <X data-icon="inline-start" />
              Bỏ chọn
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="ml-auto"
              onClick={() => setConfirmingBulkDelete(true)}
            >
              <Trash2 data-icon="inline-start" />
              Xóa {selected.size} ảnh
            </Button>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Chọn tất cả</span>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1.5 p-3 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-11">
        {images.map((image) => (
          <div key={image.path} className="group relative">
            <div className="absolute left-1.5 top-1.5 z-10">
              <Checkbox
                checked={selected.has(image.path)}
                onCheckedChange={() => toggle(image.path)}
                aria-label={`Chọn ${image.name}`}
                className="bg-background"
              />
            </div>
            <div className="absolute right-1.5 top-1.5 z-10 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                title="Sửa"
                onClick={() => onEdit(image)}
              >
                <Pencil />
              </Button>
              <DeleteResourceConfirm image={image} />
            </div>
            <button
              type="button"
              className="block w-full overflow-hidden rounded-none border border-border text-left transition hover:border-primary"
              onClick={() => setPreviewing(image)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
              <img
                src={image.url}
                alt={image.name}
                className="aspect-square w-full bg-muted/40 object-cover"
              />
              <span className="block px-1 py-0.5">
                <span className="block truncate text-xs text-foreground" title={image.name}>
                  {image.name || '(Không tên)'}
                </span>
                <span className="block truncate text-[10px] text-muted-foreground">
                  {formatDate(image.createdAt, DateFormat.DATETIME)}
                </span>
              </span>
            </button>
          </div>
        ))}
      </div>

      <ImagePreviewDialog
        image={previewing}
        onOpenChange={(open) => {
          if (!open) setPreviewing(null);
        }}
      />

      <AlertDialog open={confirmingBulkDelete} onOpenChange={setConfirmingBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {selected.size} ảnh đã chọn?</AlertDialogTitle>
            <AlertDialogDescription>Không thể hoàn tác thao tác này.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={bulkDeleteMutation.isPending}
              onClick={() => {
                bulkDeleteMutation.mutate([...selected], {
                  onSuccess: () => setConfirmingBulkDelete(false),
                });
              }}
            >
              {bulkDeleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

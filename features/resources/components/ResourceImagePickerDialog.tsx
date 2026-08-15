'use client';

import { useState } from 'react';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { ResourceImage } from '@/features/resources/api';
import { FolderSidebar } from '@/features/resources/components/FolderSidebar';
import { useResourceImages } from '@/features/resources/hooks';

type ResourceImagePickerDialogProps = {
  onSelect: (image: ResourceImage) => void;
  disabled?: boolean;
};

export function ResourceImagePickerDialog({ onSelect, disabled }: ResourceImagePickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState<string | null>(null);
  const { data: images, isLoading } = useResourceImages(folder, { enabled: open });
  const list = images ?? [];

  function handlePick(image: ResourceImage) {
    onSelect(image);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled}>
          <Images data-icon="inline-start" />
          Chọn từ thư viện
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 data-[side=right]:w-full data-[side=right]:max-w-4xl data-[side=right]:sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Chọn ảnh từ thư viện</SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden px-6 pb-6">
          <div className="w-40 shrink-0 overflow-y-auto sm:w-56">
            <FolderSidebar selectedName={folder} onSelect={setFolder} readOnly />
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto rounded-none border border-border bg-card shadow-[var(--shadow-soft)]">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Đang tải ảnh...</p>
            ) : null}
            {!isLoading && list.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Chưa có ảnh nào trong thư viện.</p>
            ) : null}
            <div className="grid grid-cols-6 gap-1.5 p-3 sm:grid-cols-7">
              {list.map((image) => (
                <button
                  key={image.path}
                  type="button"
                  title={image.name}
                  className="overflow-hidden rounded-none border border-border transition hover:border-primary"
                  onClick={() => handlePick(image)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
                  <img
                    src={image.url}
                    alt={image.name}
                    className="aspect-square w-full bg-muted/40 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

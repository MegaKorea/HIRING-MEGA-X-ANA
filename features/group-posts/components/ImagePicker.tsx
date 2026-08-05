'use client';

import { useId, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ImagePickerProps = {
  previewUrl: string | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  onClear: () => void;
};

export function ImagePicker({ previewUrl, disabled, onChange, onClear }: ImagePickerProps) {
  const inputId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null);
    event.target.value = '';
  }

  return (
    <div className="grid min-w-0 gap-2">
      <Label>Ảnh (tuỳ chọn)</Label>
      {previewUrl ? (
        <div className="relative w-28 overflow-hidden rounded-xl border border-border sm:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL */}
          <img
            src={previewUrl}
            alt="Ảnh đã chọn"
            className="aspect-square w-full bg-muted/40 object-contain"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute top-1.5 right-1.5 rounded-full"
            disabled={disabled}
            onClick={onClear}
            aria-label="Xóa ảnh"
          >
            <X />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            'flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-3 text-center transition hover:bg-muted/50 sm:h-16',
            disabled && 'pointer-events-none opacity-60',
          )}
        >
          <ImagePlus className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Chọn ảnh</span>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            · JPEG/PNG/WebP · tối đa 5MB
          </span>
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
}

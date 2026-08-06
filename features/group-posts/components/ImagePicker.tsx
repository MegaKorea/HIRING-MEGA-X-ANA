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
        <div className="relative w-full overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL */}
          <img
            src={previewUrl}
            alt="Ảnh đã chọn"
            className="mx-auto max-h-52 w-full bg-muted/40 object-contain sm:max-h-72 lg:max-h-[28rem]"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute top-1.5 right-1.5 rounded-md"
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
            'flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-3 py-6 text-center transition hover:bg-muted/50 sm:min-h-36',
            disabled && 'pointer-events-none opacity-60',
          )}
        >
          <ImagePlus className="size-5 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Chọn ảnh</span>
          <span className="text-[11px] text-muted-foreground">JPEG/PNG/WebP · tối đa 10MB</span>
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

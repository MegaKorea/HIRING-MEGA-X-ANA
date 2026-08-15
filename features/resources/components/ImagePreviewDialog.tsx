'use client';

import { useState } from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { ResourceImage } from '@/features/resources/api';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.5;

type ImagePreviewDialogProps = {
  image: ResourceImage | null;
  onOpenChange: (open: boolean) => void;
};

export function ImagePreviewDialog({ image, onOpenChange }: ImagePreviewDialogProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Reset rotation/zoom whenever a different image is shown — adjusting state
  // during render instead of an effect, per React docs.
  const [trackedPath, setTrackedPath] = useState(image?.path);
  if (image && image.path !== trackedPath) {
    setTrackedPath(image.path);
    setRotation(0);
    setZoom(1);
  }

  return (
    <Dialog open={!!image} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="w-auto max-w-[90vw] gap-3 border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[90vw]">
        <DialogTitle className="sr-only">{image?.name || 'Xem ảnh'}</DialogTitle>
        {image ? (
          <div className="grid justify-items-center gap-3">
            <div className="flex h-[65vh] w-[min(65vh,80vw)] items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
              <img
                src={image.url}
                alt={image.name}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-transform duration-150"
                style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                title="Xoay trái"
                onClick={() => setRotation((prev) => prev - 90)}
              >
                <RotateCcw />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                title="Xoay phải"
                onClick={() => setRotation((prev) => prev + 90)}
              >
                <RotateCw />
              </Button>
              <div className="mx-1 h-5 w-px bg-border" />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                title="Thu nhỏ"
                onClick={() => setZoom((prev) => Math.max(ZOOM_MIN, prev - ZOOM_STEP))}
              >
                <ZoomOut />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                title="Phóng to"
                onClick={() => setZoom((prev) => Math.min(ZOOM_MAX, prev + ZOOM_STEP))}
              >
                <ZoomIn />
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePicker } from '@/features/group-posts/components/ImagePicker';
import { useCreateResourceImage } from '@/features/resources/hooks';

type UploadResourceDialogProps = {
  defaultFolder?: string | null;
};

export function UploadResourceDialog({ defaultFolder }: UploadResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const createMutation = useCreateResourceImage();

  function reset() {
    setName('');
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function handleSubmit() {
    if (!image || !defaultFolder) return;
    createMutation.mutate(
      { folder: defaultFolder, name: name.trim() || null, image },
      { onSuccess: () => handleOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={!defaultFolder}
          title={defaultFolder ? undefined : 'Chọn một folder trước khi tải ảnh lên'}
        >
          <Upload data-icon="inline-start" />
          Tải ảnh lên
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tải ảnh vào folder &quot;{defaultFolder}&quot;</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="resource-name">Tên ảnh</Label>
            <Input
              id="resource-name"
              value={name}
              disabled={createMutation.isPending}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <ImagePicker
            previewUrl={previewUrl}
            disabled={createMutation.isPending}
            label="Ảnh"
            onChange={(file) => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setImage(file);
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
            onClear={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setImage(null);
              setPreviewUrl(null);
            }}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            disabled={!image || !defaultFolder || createMutation.isPending}
            onClick={handleSubmit}
          >
            <Plus data-icon="inline-start" />
            {createMutation.isPending ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

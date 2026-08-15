'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ResourceImage } from '@/features/resources/api';
import { useResourceFolders, useUpdateResourceImage } from '@/features/resources/hooks';

type EditResourceImageDialogProps = {
  image: ResourceImage | null;
  onOpenChange: (open: boolean) => void;
};

export function EditResourceImageDialog({ image, onOpenChange }: EditResourceImageDialogProps) {
  const { data: folders } = useResourceFolders();
  const updateMutation = useUpdateResourceImage();
  const [name, setName] = useState('');
  const [folder, setFolder] = useState<string | null>(null);

  return (
    <Dialog
      open={!!image}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next && image) {
          setName(image.name);
          setFolder(image.folder);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa ảnh</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-resource-name">Tên ảnh</Label>
            <Input
              id="edit-resource-name"
              value={name}
              disabled={updateMutation.isPending}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-resource-folder">Folder</Label>
            <Select
              value={folder ?? undefined}
              disabled={updateMutation.isPending}
              onValueChange={setFolder}
            >
              <SelectTrigger id="edit-resource-folder" className="w-full bg-background">
                <SelectValue placeholder="Chọn folder" />
              </SelectTrigger>
              <SelectContentPopper>
                {(folders ?? []).map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContentPopper>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            disabled={!folder || updateMutation.isPending}
            onClick={() => {
              if (!image || !folder) return;
              updateMutation.mutate(
                { path: image.path, input: { name: name.trim() || null, folder } },
                { onSuccess: () => onOpenChange(false) },
              );
            }}
          >
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

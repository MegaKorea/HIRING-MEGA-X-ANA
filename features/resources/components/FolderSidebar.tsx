'use client';

import { useState, type FormEvent } from 'react';
import { FolderPlus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { ResourceFolder } from '@/features/resources/api';
import {
  useCreateResourceFolder,
  useDeleteResourceFolder,
  useRenameResourceFolder,
  useResourceFolders,
} from '@/features/resources/hooks';
import { cn } from '@/lib/utils';

function FolderNameDialog({
  open,
  title,
  initialName,
  pending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  title: string;
  initialName: string;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) setName(initialName);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            value={name}
            disabled={pending}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tên folder"
          />
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || pending}>
              {pending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FolderSidebarProps = {
  selectedName: string | null;
  onSelect: (name: string | null) => void;
  readOnly?: boolean;
};

export function FolderSidebar({ selectedName, onSelect, readOnly }: FolderSidebarProps) {
  const { data: folders } = useResourceFolders();
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<ResourceFolder | null>(null);
  const [deleting, setDeleting] = useState<ResourceFolder | null>(null);

  const createMutation = useCreateResourceFolder();
  const renameMutation = useRenameResourceFolder();
  const deleteMutation = useDeleteResourceFolder();

  return (
    <div className="grid w-full shrink-0 gap-1 sm:w-56">
      <Button
        type="button"
        variant={selectedName === null ? 'secondary' : 'ghost'}
        className="justify-start"
        onClick={() => onSelect(null)}
      >
        Tất cả
      </Button>

      {(folders ?? []).map((folder) => (
        <div key={folder.name} className="group flex items-center gap-1">
          <Button
            type="button"
            variant={selectedName === folder.name ? 'secondary' : 'ghost'}
            className="min-w-0 flex-1 justify-start"
            onClick={() => onSelect(folder.name)}
          >
            <span className="truncate">{folder.name}</span>
            <span className="ml-auto text-muted-foreground">{folder.count}</span>
          </Button>
          {readOnly ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    'shrink-0 opacity-0 group-hover:opacity-100',
                    'data-open:opacity-100',
                  )}
                  title="Tuỳ chọn folder"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto min-w-0 p-1">
                <DropdownMenuItem
                  aria-label="Đổi tên"
                  className="justify-center px-2"
                  onSelect={() => setRenaming(folder)}
                >
                  <Pencil />
                </DropdownMenuItem>
                <DropdownMenuItem
                  aria-label="Xóa"
                  variant="destructive"
                  className="justify-center px-2"
                  onSelect={() => setDeleting(folder)}
                >
                  <Trash2 />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}

      {readOnly ? null : (
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="justify-start">
              <FolderPlus data-icon="inline-start" />
              Folder mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo folder mới</DialogTitle>
            </DialogHeader>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const name = String(form.get('name') ?? '').trim();
                if (!name) return;
                createMutation.mutate(name, { onSuccess: () => setCreating(false) });
              }}
            >
              <Input
                name="name"
                autoFocus
                placeholder="Tên folder"
                disabled={createMutation.isPending}
              />
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Đang tạo...' : 'Tạo folder'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {readOnly ? null : (
        <>
          <FolderNameDialog
            open={!!renaming}
            title={`Đổi tên "${renaming?.name ?? ''}"`}
            initialName={renaming?.name ?? ''}
            pending={renameMutation.isPending}
            onOpenChange={(next) => {
              if (!next) setRenaming(null);
            }}
            onSubmit={(name) => {
              if (!renaming) return;
              renameMutation.mutate(
                { name: renaming.name, newName: name },
                { onSuccess: () => setRenaming(null) },
              );
            }}
          />

          <AlertDialog
            open={!!deleting}
            onOpenChange={(next) => {
              if (!next) setDeleting(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa folder &quot;{deleting?.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  {deleting && deleting.count > 0
                    ? `Folder này có ${deleting.count} ảnh — xóa folder sẽ xóa luôn các ảnh bên trong.`
                    : 'Folder này đang trống.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (!deleting) return;
                    const name = deleting.name;
                    deleteMutation.mutate(name, {
                      onSuccess: () => {
                        setDeleting(null);
                        if (selectedName === name) onSelect(null);
                      },
                    });
                  }}
                >
                  {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa folder'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}

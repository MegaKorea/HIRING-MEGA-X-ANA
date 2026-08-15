'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createResourceFolder,
  createResourceImage,
  deleteResourceFolder,
  deleteResourceImage,
  listResourceFolders,
  listResourceImages,
  renameResourceFolder,
  resourceFoldersQueryKey,
  resourceImagesQueryKey,
  updateResourceImage,
} from '@/features/resources/api';
import { getErrorMessage } from '@/lib/utils';

export function useResourceImages(folder?: string | null) {
  return useQuery({
    queryKey: [...resourceImagesQueryKey, folder ?? ''],
    queryFn: () => listResourceImages(folder),
  });
}

export function useResourceFolders() {
  return useQuery({
    queryKey: resourceFoldersQueryKey,
    queryFn: listResourceFolders,
  });
}

export function useCreateResourceImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResourceImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resourceImagesQueryKey });
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      toast.success('Đã tải ảnh lên');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không tải được ảnh lên'));
    },
  });
}

export function useUpdateResourceImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      path,
      input,
    }: {
      path: string;
      input: Parameters<typeof updateResourceImage>[1];
    }) => updateResourceImage(path, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resourceImagesQueryKey });
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      toast.success('Đã cập nhật ảnh');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không cập nhật được ảnh'));
    },
  });
}

export function useDeleteResourceImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResourceImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resourceImagesQueryKey });
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      toast.success('Đã xóa ảnh');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không xóa được ảnh'));
    },
  });
}

export function useDeleteResourceImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paths: string[]) => Promise.all(paths.map((path) => deleteResourceImage(path))),
    onSuccess: async (_data, paths) => {
      await queryClient.invalidateQueries({ queryKey: resourceImagesQueryKey });
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      toast.success(`Đã xóa ${paths.length} ảnh`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không xóa được ảnh'));
    },
  });
}

export function useCreateResourceFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResourceFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      toast.success('Đã tạo folder');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không tạo được folder'));
    },
  });
}

export function useRenameResourceFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, newName }: { name: string; newName: string }) =>
      renameResourceFolder(name, newName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      await queryClient.invalidateQueries({ queryKey: resourceImagesQueryKey });
      toast.success('Đã đổi tên folder');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không đổi tên được folder'));
    },
  });
}

export function useDeleteResourceFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResourceFolder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resourceFoldersQueryKey });
      await queryClient.invalidateQueries({ queryKey: resourceImagesQueryKey });
      toast.success('Đã xóa folder');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không xóa được folder'));
    },
  });
}

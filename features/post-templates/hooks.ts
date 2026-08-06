'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createPostTemplate,
  deletePostTemplate,
  getPostTemplate,
  listPostTemplates,
  postTemplatesQueryKey,
  updatePostTemplate,
  POST_TEMPLATES_PAGE_SIZE,
} from '@/features/post-templates/api';
import { getErrorMessage } from '@/lib/utils';

export function usePostTemplates(
  page: number,
  category?: string | null,
  isActive?: boolean,
  enabled = true,
) {
  return useQuery({
    queryKey: [...postTemplatesQueryKey, page, category ?? '', isActive ?? ''],
    queryFn: () =>
      listPostTemplates({
        page,
        pageSize: POST_TEMPLATES_PAGE_SIZE,
        category,
        is_active: isActive,
      }),
    enabled,
  });
}

export function usePostTemplate(id: number | null) {
  return useQuery({
    queryKey: [...postTemplatesQueryKey, 'detail', id],
    queryFn: () => getPostTemplate(id!),
    enabled: id != null && id > 0,
  });
}

export function useCreatePostTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostTemplate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postTemplatesQueryKey });
      toast.success('Đã tạo content');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không tạo được content'));
    },
  });
}

export function useUpdatePostTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Parameters<typeof updatePostTemplate>[1];
    }) => updatePostTemplate(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postTemplatesQueryKey });
      toast.success('Đã cập nhật content');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không cập nhật được content'));
    },
  });
}

export function useDeletePostTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostTemplate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postTemplatesQueryKey });
      toast.success('Đã xóa content');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không xóa được content'));
    },
  });
}

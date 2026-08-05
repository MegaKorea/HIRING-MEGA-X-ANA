'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createGroupPost,
  listGroupIdsByCategory,
  listRecruitmentCategories,
  recruitmentCategoriesQueryKey,
} from '@/features/group-posts/api';
import { getErrorMessage } from '@/lib/utils';

export function useRecruitmentCategories() {
  return useQuery({
    queryKey: recruitmentCategoriesQueryKey,
    queryFn: () => listRecruitmentCategories().then((res) => res.data),
  });
}

export function useGroupIdsByCategory(category: string | null) {
  return useQuery({
    queryKey: [...recruitmentCategoriesQueryKey, 'group-ids', category ?? ''],
    queryFn: () => listGroupIdsByCategory(category!).then((res) => res.data),
    enabled: !!category,
  });
}

export function useCreateGroupPost() {
  return useMutation({
    mutationFn: createGroupPost,
    onSuccess: (res) => {
      toast.success(`Đã gửi bài tới ${res.data.group_count} nhóm`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không đăng được bài'));
    },
  });
}

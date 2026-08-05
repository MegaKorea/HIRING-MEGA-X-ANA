'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createRecruitmentGroup,
  deleteRecruitmentGroup,
  listRecruitmentGroups,
  recruitmentGroupsQueryKey,
  updateRecruitmentGroup,
  type RecruitmentGroupsListResult,
} from '@/features/recruitment-groups/api';
import type { UpdateRecruitmentGroupInput } from '@/lib/validators/recruitment-group';
import { getErrorMessage } from '@/lib/utils';

type UpdateVariables = {
  id: number;
  input: UpdateRecruitmentGroupInput;
  silent?: boolean;
};

function invalidateGroups(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: recruitmentGroupsQueryKey });
}

export function useRecruitmentGroups(
  page: number,
  pageSize: number,
  category?: string | null,
) {
  return useQuery({
    queryKey: [...recruitmentGroupsQueryKey, page, pageSize, category ?? ''],
    queryFn: () => listRecruitmentGroups({ page, pageSize, category }),
    enabled: pageSize > 0,
  });
}

export function useCreateRecruitmentGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecruitmentGroup,
    onSuccess: async () => {
      await invalidateGroups(queryClient);
      toast.success('Đã tạo nhóm');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không tạo được nhóm'));
    },
  });
}

export function useUpdateRecruitmentGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateVariables) => updateRecruitmentGroup(id, input),
    onMutate: async (variables) => {
      if (!variables.silent) return;

      await queryClient.cancelQueries({ queryKey: recruitmentGroupsQueryKey });
      const previous = queryClient.getQueriesData<RecruitmentGroupsListResult>({
        queryKey: recruitmentGroupsQueryKey,
      });

      queryClient.setQueriesData<RecruitmentGroupsListResult>(
        { queryKey: recruitmentGroupsQueryKey },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.map((group) =>
              group.id === variables.id ? { ...group, ...variables.input } : group,
            ),
          };
        },
      );

      return { previous };
    },
    onSuccess: async (_data, variables) => {
      if (variables.silent) {
        void invalidateGroups(queryClient);
        return;
      }
      await invalidateGroups(queryClient);
      toast.success('Đã cập nhật nhóm');
    },
    onError: (error, _variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(getErrorMessage(error, 'Không cập nhật được nhóm'));
    },
  });
}

export function useDeleteRecruitmentGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecruitmentGroup,
    onSuccess: async () => {
      await invalidateGroups(queryClient);
      toast.success('Đã xóa nhóm');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Không xóa được nhóm'));
    },
  });
}

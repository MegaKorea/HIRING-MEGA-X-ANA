import { api } from '@/lib/axios';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';
import type {
  CreateRecruitmentGroupInput,
  UpdateRecruitmentGroupInput,
} from '@/lib/validators/recruitment-group';

export { UNCATEGORIZED_FILTER } from '@/lib/validators';

export const RECRUITMENT_GROUPS_PAGE_SIZE = 12;

export const recruitmentGroupsQueryKey = ['recruitment-groups'] as const;

export type RecruitmentGroupsListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  categories: string[];
};

export type RecruitmentGroupsListResult = {
  data: RecruitmentGroup[];
  meta: RecruitmentGroupsListMeta;
};

export type ListRecruitmentGroupsParams = {
  page?: number;
  pageSize?: number;
  category?: string | null;
};

type ItemResponse = { data: RecruitmentGroup };

export function getRecruitmentGroup(id: number) {
  return api.get<ItemResponse>(`/recruitment-groups/${id}`).then((res) => res.data);
}

export function listRecruitmentGroups({
  page = 1,
  pageSize = RECRUITMENT_GROUPS_PAGE_SIZE,
  category,
}: ListRecruitmentGroupsParams = {}) {
  return api.get<RecruitmentGroupsListResult>('/recruitment-groups', {
    params: {
      page,
      pageSize,
      ...(category ? { category } : {}),
    },
  });
}

export function createRecruitmentGroup(input: CreateRecruitmentGroupInput) {
  return api.post<ItemResponse>('/recruitment-groups', input).then((res) => res.data);
}

export function updateRecruitmentGroup(id: number, input: UpdateRecruitmentGroupInput) {
  return api.patch<ItemResponse>(`/recruitment-groups/${id}`, input).then((res) => res.data);
}

export function deleteRecruitmentGroup(id: number) {
  return api.delete<{ data: { id: number } }>(`/recruitment-groups/${id}`).then((res) => res.data);
}

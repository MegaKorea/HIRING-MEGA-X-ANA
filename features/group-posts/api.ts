import { api } from '@/lib/axios';
import type { GroupAvailabilityMeta } from '@/lib/utils/group-availability';
import type { GroupPostWebhookPayload } from '@/lib/validators/group-post';

export const recruitmentCategoriesQueryKey = ['recruitment-categories'] as const;

export type CreateGroupPostResult = GroupPostWebhookPayload & {
  group_count: number;
};

export type GroupIdsByCategoryResponse = {
  data: string[];
  meta: GroupAvailabilityMeta;
};

export type RecruitmentCategoryOption = {
  category: string;
  total_groups: number;
  with_group_id: number;
  ready_groups: number;
};

export type RecruitmentCategoriesResponse = {
  data: RecruitmentCategoryOption[];
  meta: {
    used_categories: string[];
  };
};

export function listRecruitmentCategories() {
  return api.get<RecruitmentCategoriesResponse>('/recruitment-groups/categories');
}

export function listGroupIdsByCategory(category: string) {
  return api.get<GroupIdsByCategoryResponse>('/recruitment-groups/group-ids', {
    params: { category },
  });
}

export function createGroupPost(input: {
  content: string;
  category: string;
  image?: File | null;
  imageUrl?: string | null;
}) {
  const formData = new FormData();
  formData.append('content', input.content);
  formData.append('category', input.category);
  if (input.image) {
    formData.append('image', input.image);
  } else if (input.imageUrl) {
    formData.append('image_url', input.imageUrl);
  }

  return api.post<{ data: CreateGroupPostResult }>('/group-posts', formData);
}

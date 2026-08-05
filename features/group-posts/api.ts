import { api } from '@/lib/axios';
import type { GroupPostWebhookPayload } from '@/lib/validators/group-post';

export const groupPostsQueryKey = ['group-posts'] as const;
export const recruitmentCategoriesQueryKey = ['recruitment-categories'] as const;

export type CreateGroupPostResult = GroupPostWebhookPayload & {
  group_count: number;
};

export function listRecruitmentCategories() {
  return api.get<{ data: string[] }>('/recruitment-groups/categories');
}

export function listGroupIdsByCategory(category: string) {
  return api.get<{ data: string[] }>('/recruitment-groups/group-ids', {
    params: { category },
  });
}

export function createGroupPost(input: {
  content: string;
  category: string;
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append('content', input.content);
  formData.append('category', input.category);
  if (input.image) {
    formData.append('image', input.image);
  }

  return api.post<{ data: CreateGroupPostResult }>('/group-posts', formData);
}

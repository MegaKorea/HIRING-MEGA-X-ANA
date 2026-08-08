import { api } from '@/lib/axios';
import type { PostTemplate } from '@/lib/supabase/types/tables';
import type {
  CreatePostTemplateInput,
  UpdatePostTemplateInput,
} from '@/lib/validators/post-template';

export const POST_TEMPLATES_PAGE_SIZE = 20;
export const postTemplatesQueryKey = ['post-templates'] as const;

export type PostTemplatesListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PostTemplatesListResult = {
  data: PostTemplate[];
  meta: PostTemplatesListMeta;
};

type ItemResponse = { data: PostTemplate };

type TemplateImageInput = {
  image?: File | null;
  clear_image?: boolean;
};

function appendTemplateFields(
  formData: FormData,
  input: Partial<CreatePostTemplateInput> & TemplateImageInput,
) {
  if (input.category != null) formData.append('category', input.category);
  if (input.content != null) formData.append('content', input.content);
  if (input.image_url !== undefined) formData.append('image_url', input.image_url ?? '');
  if (typeof input.is_active === 'boolean') {
    formData.append('is_active', String(input.is_active));
  }
  if (input.note !== undefined) formData.append('note', input.note ?? '');
  if (input.clear_image) formData.append('clear_image', '1');
  if (input.image) formData.append('image', input.image);
}

export function listPostTemplates(params: {
  page?: number;
  pageSize?: number;
  category?: string | null;
  is_active?: boolean;
} = {}) {
  return api.get<PostTemplatesListResult>('/post-templates', {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? POST_TEMPLATES_PAGE_SIZE,
      ...(params.category ? { category: params.category } : {}),
      ...(typeof params.is_active === 'boolean'
        ? { is_active: String(params.is_active) }
        : {}),
    },
  });
}

export function getPostTemplate(id: number) {
  return api.get<ItemResponse>(`/post-templates/${id}`).then((res) => res.data);
}

export function createPostTemplate(
  input: CreatePostTemplateInput & { image?: File | null },
) {
  if (input.image) {
    const formData = new FormData();
    appendTemplateFields(formData, input);
    return api.post<ItemResponse>('/post-templates', formData).then((res) => res.data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructure to strip `image` before sending JSON
  const { image: _image, ...payload } = input;
  return api.post<ItemResponse>('/post-templates', payload).then((res) => res.data);
}

export function updatePostTemplate(
  id: number,
  input: UpdatePostTemplateInput & TemplateImageInput,
) {
  if (input.image || input.clear_image) {
    const formData = new FormData();
    appendTemplateFields(formData, input);
    return api.patch<ItemResponse>(`/post-templates/${id}`, formData).then((res) => res.data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructure to strip `image`/`clear_image` before sending JSON
  const { image: _image, clear_image: _clear, ...payload } = input;
  return api.patch<ItemResponse>(`/post-templates/${id}`, payload).then((res) => res.data);
}

export function deletePostTemplate(id: number) {
  return api.delete<{ data: { id: number } }>(`/post-templates/${id}`).then((res) => res.data);
}

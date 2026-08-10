import { api } from '@/lib/axios';
import type { PostLog } from '@/lib/supabase/types/tables';

export const POST_LOG_PAGE_SIZE = 10;
export const postLogQueryKey = ['post-log'] as const;

export type PostLogListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PostLogListResult = {
  data: PostLog[];
  meta: PostLogListMeta;
};

export type ListPostLogParams = {
  page?: number;
  pageSize?: number;
  category?: string | null;
  ok?: boolean | null;
  q?: string | null;
};

export function listPostLog({
  page = 1,
  pageSize = POST_LOG_PAGE_SIZE,
  category,
  ok,
  q,
}: ListPostLogParams = {}) {
  return api.get<PostLogListResult>('/post-log', {
    params: {
      page,
      pageSize,
      ...(category ? { category } : {}),
      ...(typeof ok === 'boolean' ? { ok: String(ok) } : {}),
      ...(q ? { q } : {}),
    },
  });
}

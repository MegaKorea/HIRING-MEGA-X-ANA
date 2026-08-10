'use client';

import { useQuery } from '@tanstack/react-query';
import { listPostLog, postLogQueryKey, POST_LOG_PAGE_SIZE } from '@/features/post-log/api';

export function usePostLog(
  page: number,
  category?: string | null,
  ok?: boolean | null,
  q?: string | null,
) {
  return useQuery({
    queryKey: [...postLogQueryKey, page, category ?? '', ok ?? '', q ?? ''],
    queryFn: () =>
      listPostLog({
        page,
        pageSize: POST_LOG_PAGE_SIZE,
        category,
        ok,
        q,
      }),
  });
}

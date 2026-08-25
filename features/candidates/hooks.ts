'use client';

import { useQuery } from '@tanstack/react-query';
import { candidatesQueryKey, listCandidates } from '@/features/candidates/api';

export function useCandidates() {
  return useQuery({
    queryKey: candidatesQueryKey,
    queryFn: listCandidates,
  });
}

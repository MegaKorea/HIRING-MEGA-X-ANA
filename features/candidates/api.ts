import { api } from '@/lib/axios';

export const candidatesQueryKey = ['candidates'] as const;

export type CandidateRecord = {
  record_id: string;
  fields: Record<string, unknown>;
};

export type CandidatesListResult = {
  data: CandidateRecord[];
  columns: string[];
};

export function listCandidates() {
  return api.get<CandidatesListResult>('/candidates');
}

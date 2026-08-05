export type RecruitmentGroup = {
  id: number;
  name: string;
  category: string | null;
  group_id: string | null;
  rate: number | null;
  link: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type RecruitmentGroupInsert = {
  name: string;
  category?: string | null;
  group_id?: string | null;
  rate?: number | null;
  link?: string | null;
  note?: string | null;
};

export type RecruitmentGroupUpdate = Partial<RecruitmentGroupInsert> & {
  updated_at?: string;
};

export type RecruitmentGroupTable = {
  Row: RecruitmentGroup;
  Insert: RecruitmentGroupInsert;
  Update: RecruitmentGroupUpdate;
  Relationships: [];
};

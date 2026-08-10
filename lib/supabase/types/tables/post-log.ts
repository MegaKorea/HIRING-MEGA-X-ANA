export type PostLog = {
  id: number;
  run_id: string;
  category: string | null;
  page_id: string | null;
  group_id: string;
  template_id: number | null;
  content: string | null;
  image_url: string;
  post_id: string | null;
  ok: boolean;
  error: string | null;
  posted_at: string;
};

export type PostLogInsert = {
  run_id: string;
  category?: string | null;
  page_id?: string | null;
  group_id: string;
  template_id?: number | null;
  content?: string | null;
  image_url?: string;
  post_id?: string | null;
  ok?: boolean;
  error?: string | null;
  posted_at?: string;
};

export type PostLogUpdate = Partial<PostLogInsert>;

export type PostLogTable = {
  Row: PostLog;
  Insert: PostLogInsert;
  Update: PostLogUpdate;
  Relationships: [];
};

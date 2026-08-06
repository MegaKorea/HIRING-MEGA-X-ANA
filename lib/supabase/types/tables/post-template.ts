export type PostTemplate = {
  id: number;
  category: string;
  content: string;
  image_url: string;
  is_active: boolean;
  last_posted_at: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type PostTemplateInsert = {
  category: string;
  content: string;
  image_url?: string;
  is_active?: boolean;
  last_posted_at?: string | null;
  note?: string | null;
};

export type PostTemplateUpdate = Partial<PostTemplateInsert> & {
  updated_at?: string;
};

export type PostTemplateTable = {
  Row: PostTemplate;
  Insert: PostTemplateInsert;
  Update: PostTemplateUpdate;
  Relationships: [];
};

import type { PostLogTable } from '@/lib/supabase/types/tables/post-log';
import type { PostTemplateTable } from '@/lib/supabase/types/tables/post-template';
import type { RecruitmentGroupTable } from '@/lib/supabase/types/tables/recruitment-group';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      recruitment_group: RecruitmentGroupTable;
      post_template: PostTemplateTable;
      post_log: PostLogTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

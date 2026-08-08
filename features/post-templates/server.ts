import { throwIfSupabaseError } from '@/errors';
import { createClient } from '@/lib/supabase/server';
import type { PostTemplate } from '@/lib/supabase/types/tables';

/** Content đang bật của một danh mục — nguồn để n8n random theo từng nhóm. */
export async function listActiveTemplatesByCategory(
  category: string,
): Promise<PostTemplate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('post_template')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('id', { ascending: true });

  throwIfSupabaseError(error, 'Không tải được content theo danh mục.');
  return data ?? [];
}

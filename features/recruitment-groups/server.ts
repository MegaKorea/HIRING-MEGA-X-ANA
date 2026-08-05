import { throwIfSupabaseError } from '@/errors';
import { createClient } from '@/lib/supabase/server';

/** Facebook group_id list for a recruitment category (deduped, non-empty). */
export async function getGroupIdsByCategory(category: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recruitment_group')
    .select('group_id')
    .eq('category', category)
    .not('group_id', 'is', null);

  throwIfSupabaseError(error, 'Không tải được Group ID theo danh mục.');

  return [
    ...new Set(
      (data ?? [])
        .map((row) => row.group_id?.trim())
        .filter((id): id is string => !!id),
    ),
  ];
}

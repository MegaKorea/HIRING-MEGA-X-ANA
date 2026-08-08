import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createClient } from '@/lib/supabase/server';
import type { GroupAvailabilityMeta } from '@/lib/utils/group-availability';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';

export type ListActiveGroupsResult = {
  groups: RecruitmentGroup[];
  meta: GroupAvailabilityMeta;
};

export async function listActiveGroupsByCategory(category: string): Promise<ListActiveGroupsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recruitment_group')
    .select('*')
    .eq('category', category);

  throwIfSupabaseError(error, 'Không tải được nhóm theo danh mục.');

  const rows = data ?? [];
  let withGroupId = 0;
  let withoutGroupId = 0;
  let inactiveWithGroupId = 0;
  const activeGroups: RecruitmentGroup[] = [];

  for (const row of rows) {
    const id = row.group_id?.trim() ?? '';
    if (!id) {
      withoutGroupId += 1;
      continue;
    }
    withGroupId += 1;
    if (row.is_active === false) {
      inactiveWithGroupId += 1;
      continue;
    }
    activeGroups.push(row);
  }

  return {
    groups: activeGroups,
    meta: {
      total_in_category: rows.length,
      with_group_id: withGroupId,
      without_group_id: withoutGroupId,
      inactive_with_group_id: inactiveWithGroupId,
    },
  };
}

export async function markRecruitmentGroupPosted(
  id: number,
  lastPostedAt = new Date().toISOString(),
): Promise<RecruitmentGroup> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recruitment_group')
    .update({ last_posted_at: lastPostedAt, updated_at: lastPostedAt })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  throwIfSupabaseError(error, 'Không cập nhật được thời điểm đăng nhóm.');
  if (!data) {
    fail('RECRUITMENT_GROUP_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy nhóm');
  }
  return data;
}

/** Marks many groups posted in a single round-trip — use when the per-row result isn't needed. */
export async function markRecruitmentGroupsPosted(
  ids: number[],
  lastPostedAt = new Date().toISOString(),
): Promise<void> {
  if (ids.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from('recruitment_group')
    .update({ last_posted_at: lastPostedAt, updated_at: lastPostedAt })
    .in('id', ids);

  throwIfSupabaseError(error, 'Không cập nhật được thời điểm đăng nhóm.');
}

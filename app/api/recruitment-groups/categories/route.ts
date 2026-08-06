import { NextResponse } from 'next/server';
import { throwIfSupabaseError } from '@/errors';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';

export type RecruitmentCategoryOption = {
  category: string;
  total_groups: number;
  with_group_id: number;
  ready_groups: number;
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recruitment_group')
      .select('category, group_id, is_active');

    throwIfSupabaseError(error, 'Không tải được danh mục từ danh sách nhóm.');
    const rows = data ?? [];

    const stats = new Map<
      string,
      { total_groups: number; with_group_id: number; ready_groups: number }
    >();

    for (const row of rows) {
      const category = row.category?.trim().toUpperCase();
      if (!category) continue;

      const current = stats.get(category) ?? {
        total_groups: 0,
        with_group_id: 0,
        ready_groups: 0,
      };
      current.total_groups += 1;

      const groupId = row.group_id?.trim() ?? '';
      if (groupId) {
        current.with_group_id += 1;
        if (row.is_active !== false) current.ready_groups += 1;
      }

      stats.set(category, current);
    }

    const used = [...stats.entries()]
      .filter(([, value]) => value.total_groups > 0)
      .map(([category, value]) => ({ category, ...value }))
      .sort((a, b) => {
        const ai = RECRUITMENT_CATEGORIES.indexOf(
          a.category as (typeof RECRUITMENT_CATEGORIES)[number],
        );
        const bi = RECRUITMENT_CATEGORIES.indexOf(
          b.category as (typeof RECRUITMENT_CATEGORIES)[number],
        );
        if (ai === -1 && bi === -1) return a.category.localeCompare(b.category, 'vi');
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });

    return NextResponse.json({
      data: used,
      meta: {
        used_categories: used.map((item) => item.category),
      },
    });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_CATEGORIES_FAILED');
  }
}

import { NextResponse } from 'next/server';
import { throwIfSupabaseError } from '@/errors';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recruitment_group').select('category');

    throwIfSupabaseError(error, 'Không tải được danh mục.');

    const categorySet = new Set<string>();
    for (const row of data ?? []) {
      if (row.category) categorySet.add(row.category);
    }

    return NextResponse.json({
      data: [...categorySet].sort((a, b) => a.localeCompare(b, 'vi')),
    });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_CATEGORIES_FAILED');
  }
}

import { NextResponse } from 'next/server';
import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';
import { postLogListQuerySchema } from '@/lib/validators/post-log';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = postLogListQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      ok: searchParams.get('ok') ?? undefined,
      q: searchParams.get('q') ?? undefined,
    });

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Tham số không hợp lệ',
      );
    }

    const { page, pageSize, category, ok, q } = parsed.data;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const supabase = await createClient();

    let listQuery = supabase
      .from('post_log')
      .select('*', { count: 'exact' })
      .order('posted_at', { ascending: false })
      .range(from, to);

    if (category) {
      listQuery = listQuery.eq('category', category);
    }
    if (typeof ok === 'boolean') {
      listQuery = listQuery.eq('ok', ok);
    }
    if (q) {
      const escaped = q.replace(/[%_]/g, (match) => `\\${match}`);
      listQuery = listQuery.or(`group_id.ilike.%${escaped}%,run_id.ilike.%${escaped}%`);
    }

    const { data, error, count } = await listQuery;
    throwIfSupabaseError(error, 'Không tải được lịch sử đăng bài.');

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data: data ?? [],
      meta: { page, pageSize, total, totalPages },
    });
  } catch (error) {
    return handleRouteError(error, 'POST_LOG_LIST_FAILED');
  }
}

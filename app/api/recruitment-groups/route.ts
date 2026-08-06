import { NextResponse } from 'next/server';
import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';
import {
  recruitmentGroupListQuerySchema,
  UNCATEGORIZED_FILTER,
} from '@/lib/validators';
import { createRecruitmentGroupSchema } from '@/lib/validators/recruitment-group';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = recruitmentGroupListQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      is_active: searchParams.get('is_active') ?? undefined,
    });

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Tham số không hợp lệ',
      );
    }

    const { page, pageSize, category, is_active } = parsed.data;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const supabase = await createClient();

    let listQuery = supabase
      .from('recruitment_group')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category === UNCATEGORIZED_FILTER) {
      listQuery = listQuery.is('category', null);
    } else if (category) {
      listQuery = listQuery.eq('category', category);
    }

    if (typeof is_active === 'boolean') {
      listQuery = listQuery.eq('is_active', is_active);
    }

    const { data, error, count } = await listQuery;
    throwIfSupabaseError(error, 'Không tải được danh sách nhóm.');

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data: data ?? [],
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        categories: [...RECRUITMENT_CATEGORIES],
      },
    });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_LIST_FAILED');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createRecruitmentGroupSchema.safeParse(body);

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recruitment_group')
      .insert(parsed.data)
      .select('*')
      .single();

    throwIfSupabaseError(error, 'Không tạo được nhóm.');

    return NextResponse.json({ data }, { status: HttpStatusCode.CREATED });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_CREATE_FAILED');
  }
}

import { NextResponse } from 'next/server';
import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
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
    });

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Tham số không hợp lệ',
      );
    }

    const { page, pageSize, category } = parsed.data;
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

    const [{ data, error, count }, categoriesResult] = await Promise.all([
      listQuery,
      supabase.from('recruitment_group').select('category'),
    ]);

    throwIfSupabaseError(error, 'Không tải được danh sách nhóm.');
    throwIfSupabaseError(categoriesResult.error, 'Không tải được danh mục.');

    const categorySet = new Set<string>();
    let hasUncategorized = false;

    for (const row of categoriesResult.data ?? []) {
      if (row.category) categorySet.add(row.category);
      else hasUncategorized = true;
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data: data ?? [],
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        categories: [...categorySet].sort((a, b) => a.localeCompare(b, 'vi')),
        hasUncategorized,
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

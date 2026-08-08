import { NextResponse } from 'next/server';
import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';
import { isUploadFile, uploadImageToBucket } from '@/lib/utils/upload-image';
import {
  createPostTemplateSchema,
  postTemplateListQuerySchema,
} from '@/lib/validators/post-template';

async function parseCreatePayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Payload không hợp lệ');
    }

    const imageEntry = formData.get('image');
    const imageUrl = isUploadFile(imageEntry)
      ? await uploadImageToBucket(imageEntry, 'post-templates')
      : String(formData.get('image_url') ?? '');

    return createPostTemplateSchema.safeParse({
      category: String(formData.get('category') ?? ''),
      content: String(formData.get('content') ?? ''),
      image_url: imageUrl,
      is_active: formData.get('is_active') ?? undefined,
      note: formData.get('note') ?? undefined,
    });
  }

  const body = await request.json().catch(() => null);
  return createPostTemplateSchema.safeParse(body);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = postTemplateListQuerySchema.safeParse({
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
      .from('post_template')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to);

    if (category) {
      listQuery = listQuery.eq('category', category);
    }
    if (typeof is_active === 'boolean') {
      listQuery = listQuery.eq('is_active', is_active);
    }

    const { data, error, count } = await listQuery;
    throwIfSupabaseError(error, 'Không tải được danh sách content.');

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data: data ?? [],
      meta: { page, pageSize, total, totalPages },
    });
  } catch (error) {
    return handleRouteError(error, 'POST_TEMPLATE_LIST_FAILED');
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await parseCreatePayload(request);

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('post_template')
      .insert(parsed.data)
      .select('*')
      .single();

    throwIfSupabaseError(error, 'Không tạo được content.');

    return NextResponse.json({ data }, { status: HttpStatusCode.CREATED });
  } catch (error) {
    return handleRouteError(error, 'POST_TEMPLATE_CREATE_FAILED');
  }
}

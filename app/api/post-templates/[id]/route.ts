import { NextResponse } from 'next/server';
import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';
import { isUploadFile, uploadImageToBucket } from '@/lib/utils/upload-image';
import {
  postTemplateIdSchema,
  updatePostTemplateSchema,
} from '@/lib/validators/post-template';

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function parseUpdatePayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Payload không hợp lệ');
    }

    const imageEntry = formData.get('image');
    const clearImage = String(formData.get('clear_image') ?? '') === '1';

    let imageUrl: string | undefined;
    if (isUploadFile(imageEntry)) {
      imageUrl = await uploadImageToBucket(imageEntry, 'post-templates');
    } else if (clearImage) {
      imageUrl = '';
    } else if (formData.has('image_url')) {
      imageUrl = String(formData.get('image_url') ?? '');
    }

    return updatePostTemplateSchema.safeParse({
      ...(formData.has('category') ? { category: String(formData.get('category') ?? '') } : {}),
      ...(formData.has('content') ? { content: String(formData.get('content') ?? '') } : {}),
      ...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
      ...(formData.has('is_active') ? { is_active: formData.get('is_active') } : {}),
      ...(formData.has('note') ? { note: formData.get('note') } : {}),
    });
  }

  const body = await request.json().catch(() => null);
  return updatePostTemplateSchema.safeParse(body);
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = postTemplateIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('post_template')
      .select('*')
      .eq('id', idParsed.data)
      .maybeSingle();

    throwIfSupabaseError(error, 'Không tải được content.');
    if (!data) {
      fail('POST_TEMPLATE_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy content');
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'POST_TEMPLATE_GET_FAILED');
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = postTemplateIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const parsed = await parseUpdatePayload(request);
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
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', idParsed.data)
      .select('*')
      .maybeSingle();

    throwIfSupabaseError(error, 'Không cập nhật được content.');
    if (!data) {
      fail('POST_TEMPLATE_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy content');
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'POST_TEMPLATE_UPDATE_FAILED');
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = postTemplateIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('post_template')
      .delete()
      .eq('id', idParsed.data)
      .select('id')
      .maybeSingle();

    throwIfSupabaseError(error, 'Không xóa được content.');
    if (!data) {
      fail('POST_TEMPLATE_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy content');
    }

    return NextResponse.json({ data: { id: data.id } });
  } catch (error) {
    return handleRouteError(error, 'POST_TEMPLATE_DELETE_FAILED');
  }
}

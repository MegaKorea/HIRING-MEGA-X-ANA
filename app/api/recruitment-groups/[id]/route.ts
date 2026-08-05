import { NextResponse } from 'next/server';
import { fail, throwIfSupabaseError } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createClient } from '@/lib/supabase/server';
import { handleRouteError } from '@/lib/utils';
import {
  recruitmentGroupIdSchema,
  updateRecruitmentGroupSchema,
} from '@/lib/validators/recruitment-group';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = recruitmentGroupIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recruitment_group')
      .select('*')
      .eq('id', idParsed.data)
      .maybeSingle();

    throwIfSupabaseError(error, 'Không tải được nhóm.');

    if (!data) {
      fail('RECRUITMENT_GROUP_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy nhóm');
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_GET_FAILED');
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = recruitmentGroupIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const body = await request.json().catch(() => null);
    const parsed = updateRecruitmentGroupSchema.safeParse(body);
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
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', idParsed.data)
      .select('*')
      .maybeSingle();

    throwIfSupabaseError(error, 'Không cập nhật được nhóm.');

    if (!data) {
      fail('RECRUITMENT_GROUP_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy nhóm');
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_UPDATE_FAILED');
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = recruitmentGroupIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recruitment_group')
      .delete()
      .eq('id', idParsed.data)
      .select('id')
      .maybeSingle();

    throwIfSupabaseError(error, 'Không xóa được nhóm.');

    if (!data) {
      fail('RECRUITMENT_GROUP_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy nhóm');
    }

    return NextResponse.json({ data: { id: data.id } });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_DELETE_FAILED');
  }
}

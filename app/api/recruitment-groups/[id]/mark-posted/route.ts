import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { markRecruitmentGroupPosted } from '@/features/recruitment-groups/server';
import { handleRouteError } from '@/lib/utils';
import {
  markRecruitmentGroupPostedSchema,
  recruitmentGroupIdSchema,
} from '@/lib/validators/recruitment-group';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const idParsed = recruitmentGroupIdSchema.safeParse(rawId);
    if (!idParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'ID không hợp lệ');
    }

    const body = await request.json().catch(() => ({}));
    const parsed = markRecruitmentGroupPostedSchema.safeParse(body ?? {});
    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const data = await markRecruitmentGroupPosted(
      idParsed.data,
      parsed.data.last_posted_at ?? new Date().toISOString(),
    );

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_MARK_POSTED_FAILED');
  }
}

import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { listActiveGroupsByCategory } from '@/features/recruitment-groups/server';
import { handleRouteError } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const category = new URL(request.url).searchParams.get('category')?.trim();

    if (!category) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Thiếu danh mục');
    }

    const { groups, meta } = await listActiveGroupsByCategory(category);
    const groupIds = [
      ...new Set(groups.map((group) => group.group_id).filter((id): id is string => !!id)),
    ];

    return NextResponse.json({ data: groupIds, meta });
  } catch (error) {
    return handleRouteError(error, 'RECRUITMENT_GROUP_IDS_FAILED');
  }
}

import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { sendGroupPostWebhook } from '@/features/group-posts/server';
import {
  listActiveGroupsByCategory,
  markRecruitmentGroupsPosted,
} from '@/features/recruitment-groups/server';
import { handleRouteError } from '@/lib/utils';
import { describeGroupAvailability } from '@/lib/utils/group-availability';
import { getPlainTextFromHtml } from '@/lib/utils/html-content';
import { isUploadFile, uploadImageToBucket } from '@/lib/utils/upload-image';
import { groupPostSchema, type GroupPostWebhookPayload } from '@/lib/validators/group-post';

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Payload không hợp lệ');
    }

    const parsed = groupPostSchema.safeParse({
      content: String(formData.get('content') ?? ''),
      category: String(formData.get('category') ?? ''),
      image_url: String(formData.get('image_url') ?? ''),
    });

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const { groups, meta } = await listActiveGroupsByCategory(parsed.data.category);
    if (groups.length === 0) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, describeGroupAvailability(meta));
    }

    const imageEntry = formData.get('image');
    const imageUrl = isUploadFile(imageEntry)
      ? await uploadImageToBucket(imageEntry, 'group-posts')
      : parsed.data.image_url;

    // listActiveGroupsByCategory only returns groups with a non-empty group_id.
    const groupIds = groups.map((group) => group.group_id!);
    const plainContent = getPlainTextFromHtml(parsed.data.content);

    const payload: GroupPostWebhookPayload = {
      content: plainContent,
      image_url: imageUrl,
      category: parsed.data.category,
      group_ids: groupIds,
      type: 'group_post',
    };

    const postedAt = new Date().toISOString();

    await sendGroupPostWebhook(payload);

    await markRecruitmentGroupsPosted(
      groups.map((group) => group.id),
      postedAt,
    );

    return NextResponse.json({
      data: { ...payload, group_count: groupIds.length },
    });
  } catch (error) {
    return handleRouteError(error, 'GROUP_POST_FAILED');
  }
}

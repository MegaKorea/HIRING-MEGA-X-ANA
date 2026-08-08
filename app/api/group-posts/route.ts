import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { sendGroupPostWebhook } from '@/features/group-posts/server';
import { listActiveTemplatesByCategory } from '@/features/post-templates/server';
import {
  listActiveGroupsByCategory,
  markRecruitmentGroupsPosted,
} from '@/features/recruitment-groups/server';
import { handleRouteError } from '@/lib/utils';
import { describeGroupAvailability } from '@/lib/utils/group-availability';
import { getPlainTextFromHtml } from '@/lib/utils/html-content';
import { isUploadFile, uploadImageToBucket } from '@/lib/utils/upload-image';
import {
  groupPostSchema,
  type GroupPostContent,
  type GroupPostWebhookPayload,
} from '@/lib/validators/group-post';

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
      random_content: String(formData.get('random_content') ?? ''),
    });

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const { category, random_content } = parsed.data;

    const { groups, meta } = await listActiveGroupsByCategory(category);
    if (groups.length === 0) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, describeGroupAvailability(meta));
    }

    let contents: GroupPostContent[];
    if (random_content) {
      const templates = await listActiveTemplatesByCategory(category);
      if (templates.length === 0) {
        fail(
          'VALIDATION_ERROR',
          HttpStatusCode.BAD_REQUEST,
          `Danh mục ${category} chưa có content nào đang bật để random.`,
        );
      }
      contents = templates.map((template) => ({
        template_id: template.id,
        content: getPlainTextFromHtml(template.content),
        image_url: template.image_url ?? '',
      }));
    } else {
      const imageEntry = formData.get('image');
      const imageUrl = isUploadFile(imageEntry)
        ? await uploadImageToBucket(imageEntry, 'group-posts')
        : parsed.data.image_url;

      contents = [
        {
          template_id: null,
          content: getPlainTextFromHtml(parsed.data.content),
          image_url: imageUrl,
        },
      ];
    }

    // listActiveGroupsByCategory only returns groups with a non-empty group_id.
    const groupIds = groups.map((group) => group.group_id!);

    const payload: GroupPostWebhookPayload = {
      run_id: crypto.randomUUID(),
      category,
      group_ids: groupIds,
      contents,
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

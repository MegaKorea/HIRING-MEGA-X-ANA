import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { getGroupsAutoWebhookUrl } from '@/config/env.config';
import { getGroupIdsByCategory } from '@/features/recruitment-groups/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { handleRouteError } from '@/lib/utils';
import { groupPostSchema, type GroupPostWebhookPayload } from '@/lib/validators/group-post';

const IMAGES_BUCKET = 'images';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function extensionFromMime(mime: string) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpg';
}

async function uploadImage(file: File): Promise<string> {
  const type = file.type || 'image/jpeg';

  if (!ALLOWED_IMAGE_TYPES.has(type)) {
    fail(
      'VALIDATION_ERROR',
      HttpStatusCode.BAD_REQUEST,
      'Ảnh phải là JPEG, PNG, WebP hoặc GIF',
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Ảnh tối đa 5MB');
  }

  const nameExt = file.name.split('.').pop()?.toLowerCase();
  const ext = nameExt && nameExt.length <= 5 ? nameExt : extensionFromMime(type);
  const path = `group-posts/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const admin = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(IMAGES_BUCKET).upload(path, buffer, {
    contentType: type,
    upsert: false,
    cacheControl: '3600',
  });

  if (error) {
    fail(
      'UPLOAD_FAILED',
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message || 'Không upload được ảnh lên bucket images',
    );
  }

  const { data } = admin.storage.from(IMAGES_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) {
    fail('UPLOAD_FAILED', HttpStatusCode.INTERNAL_SERVER_ERROR, 'Không lấy được public URL ảnh');
  }

  return data.publicUrl;
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return !!value && typeof value !== 'string' && value.size > 0;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Payload không hợp lệ');
    }

    const parsed = groupPostSchema.safeParse({
      content: String(formData.get('content') ?? ''),
      category: String(formData.get('category') ?? ''),
      image_url: '',
    });

    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const groupIds = await getGroupIdsByCategory(parsed.data.category);
    if (groupIds.length === 0) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        'Danh mục này chưa có Group ID nào để đăng',
      );
    }

    const imageEntry = formData.get('image');
    const imageUrl = isUploadFile(imageEntry) ? await uploadImage(imageEntry) : '';

    const payload: GroupPostWebhookPayload = {
      content: parsed.data.content,
      image_url: imageUrl,
      category: parsed.data.category,
      group_ids: groupIds,
      type: 'group_post',
    };

    const webhookRes = await fetch(getGroupsAutoWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      const detail = await webhookRes.text().catch(() => '');
      fail(
        'WEBHOOK_FAILED',
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        detail || `Webhook trả về lỗi (${webhookRes.status})`,
      );
    }

    return NextResponse.json({
      data: { ...payload, group_count: groupIds.length },
    });
  } catch (error) {
    return handleRouteError(error, 'GROUP_POST_FAILED');
  }
}

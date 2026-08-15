import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createAdminClient } from '@/lib/supabase/admin';

export const IMAGES_BUCKET = 'images';
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function extensionFromMime(mime: string) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpg';
}

export function isUploadFile(value: FormDataEntryValue | null): value is File {
  return !!value && typeof value !== 'string' && value.size > 0;
}

export async function uploadImageToBucket(file: File, folder = 'post-templates'): Promise<string> {
  const type = file.type || 'image/jpeg';

  if (!ALLOWED_IMAGE_TYPES.has(type)) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Ảnh phải là JPEG, PNG, WebP hoặc GIF');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Ảnh tối đa 10MB');
  }

  const nameExt = file.name.split('.').pop()?.toLowerCase();
  const ext = nameExt && nameExt.length <= 5 ? nameExt : extensionFromMime(type);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
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

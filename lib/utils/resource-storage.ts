import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGES_BUCKET,
  MAX_IMAGE_BYTES,
  extensionFromMime,
} from '@/lib/utils/upload-image';

const RESOURCES_ROOT = 'resources';
const PLACEHOLDER = '.emptyFolderPlaceholder';

function bucket() {
  return createAdminClient().storage.from(IMAGES_BUCKET);
}

function sanitizeSegment(input: string): string {
  const value = input
    .trim()
    .replace(/[\\/]+/g, '-')
    .replace(/\s+/g, ' ');
  if (!value) fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Tên không hợp lệ');
  return value;
}

function slugifyImageName(name: string | null | undefined): string {
  return (name?.trim() || 'anh').replace(/[\\/]+/g, '-').replace(/-{2,}/g, '-');
}

export type ResourceFolderInfo = { name: string; count: number };
export type ResourceImageInfo = {
  path: string;
  folder: string;
  name: string;
  url: string;
  createdAt: string;
};

function toImageInfo(folder: string, fileName: string, createdAt: string): ResourceImageInfo {
  const path = `${RESOURCES_ROOT}/${folder}/${fileName}`;
  const separatorIndex = fileName.lastIndexOf('--');
  const slug =
    separatorIndex >= 0 ? fileName.slice(0, separatorIndex) : fileName.replace(/\.[^.]+$/, '');
  const { data } = bucket().getPublicUrl(path);
  return { path, folder, name: slug.replace(/-/g, ' '), url: data.publicUrl, createdAt };
}

async function listResourceFolderNames(): Promise<string[]> {
  const { data, error } = await bucket().list(RESOURCES_ROOT, { limit: 1000 });
  if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
  return (data ?? []).filter((item) => item.id === null).map((item) => item.name);
}

export async function listResourceFolders(): Promise<ResourceFolderInfo[]> {
  const names = await listResourceFolderNames();
  const withCounts = await Promise.all(
    names.map(async (name) => {
      const { data: items } = await bucket().list(`${RESOURCES_ROOT}/${name}`, { limit: 1000 });
      const count = (items ?? []).filter((item) => item.name !== PLACEHOLDER).length;
      return { name, count };
    }),
  );

  return withCounts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export async function createResourceFolder(name: string): Promise<ResourceFolderInfo> {
  const folder = sanitizeSegment(name);

  const existing = await bucket().list(`${RESOURCES_ROOT}/${folder}`, { limit: 1 });
  if (existing.data && existing.data.length > 0) {
    fail('FOLDER_NAME_TAKEN', HttpStatusCode.CONFLICT, 'Tên folder đã tồn tại');
  }

  const { error } = await bucket().upload(
    `${RESOURCES_ROOT}/${folder}/${PLACEHOLDER}`,
    Buffer.from(''),
    { upsert: false },
  );
  if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);

  return { name: folder, count: 0 };
}

export async function renameResourceFolder(
  oldName: string,
  newName: string,
): Promise<ResourceFolderInfo> {
  const from = sanitizeSegment(oldName);
  const to = sanitizeSegment(newName);
  if (from === to) return { name: to, count: 0 };

  const conflict = await bucket().list(`${RESOURCES_ROOT}/${to}`, { limit: 1 });
  if (conflict.data && conflict.data.length > 0) {
    fail('FOLDER_NAME_TAKEN', HttpStatusCode.CONFLICT, 'Tên folder đã tồn tại');
  }

  const { data: items, error } = await bucket().list(`${RESOURCES_ROOT}/${from}`, { limit: 1000 });
  if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
  if (!items || items.length === 0) {
    fail('RESOURCE_FOLDER_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy folder');
  }

  const moveErrors = await Promise.all(
    items.map(({ name }) =>
      bucket()
        .move(`${RESOURCES_ROOT}/${from}/${name}`, `${RESOURCES_ROOT}/${to}/${name}`)
        .then(({ error: moveError }) => moveError),
    ),
  );
  const firstError = moveErrors.find(Boolean);
  if (firstError) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, firstError.message);

  const count = items.filter((item) => item.name !== PLACEHOLDER).length;
  return { name: to, count };
}

export async function deleteResourceFolder(name: string): Promise<void> {
  const folder = sanitizeSegment(name);
  const { data: items, error } = await bucket().list(`${RESOURCES_ROOT}/${folder}`, {
    limit: 1000,
  });
  if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
  if (!items || items.length === 0) {
    fail('RESOURCE_FOLDER_NOT_FOUND', HttpStatusCode.NOT_FOUND, 'Không tìm thấy folder');
  }

  const paths = items.map((item) => `${RESOURCES_ROOT}/${folder}/${item.name}`);
  const { error: removeError } = await bucket().remove(paths);
  if (removeError) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, removeError.message);
}

export async function listResourceImages(folder?: string | null): Promise<ResourceImageInfo[]> {
  const folderNames = folder ? [sanitizeSegment(folder)] : await listResourceFolderNames();

  const grouped = await Promise.all(
    folderNames.map(async (folderName) => {
      const { data, error } = await bucket().list(`${RESOURCES_ROOT}/${folderName}`, {
        limit: 1000,
      });
      if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
      return (data ?? [])
        .filter((item) => item.name !== PLACEHOLDER)
        .map((item) => toImageInfo(folderName, item.name, item.created_at ?? ''));
    }),
  );

  return grouped.flat().sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export async function uploadResourceImage(
  file: File,
  folder: string,
  name?: string | null,
): Promise<ResourceImageInfo> {
  const type = file.type || 'image/jpeg';
  if (!ALLOWED_IMAGE_TYPES.has(type)) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Ảnh phải là JPEG, PNG, WebP hoặc GIF');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Ảnh tối đa 10MB');
  }

  const folderName = sanitizeSegment(folder);
  const nameExt = file.name.split('.').pop()?.toLowerCase();
  const ext = nameExt && nameExt.length <= 5 ? nameExt : extensionFromMime(type);
  const fileName = `${slugifyImageName(name)}--${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await bucket().upload(`${RESOURCES_ROOT}/${folderName}/${fileName}`, buffer, {
    contentType: type,
    upsert: false,
    cacheControl: '3600',
  });
  if (error) {
    fail(
      'UPLOAD_FAILED',
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message || 'Không upload được ảnh',
    );
  }

  return toImageInfo(folderName, fileName, new Date().toISOString());
}

export async function updateResourceImage(
  path: string,
  updates: { name?: string | null; folder?: string },
): Promise<ResourceImageInfo> {
  const segments = path.split('/');
  if (segments[0] !== RESOURCES_ROOT || segments.length !== 3) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Đường dẫn ảnh không hợp lệ');
  }
  const [, currentFolder, currentFileName] = segments;
  const targetFolder = updates.folder ? sanitizeSegment(updates.folder) : currentFolder;

  const separatorIndex = currentFileName.lastIndexOf('--');
  const suffix =
    separatorIndex >= 0 ? currentFileName.slice(separatorIndex) : `--${currentFileName}`;
  const currentSlug = separatorIndex >= 0 ? currentFileName.slice(0, separatorIndex) : '';
  const nextSlug =
    updates.name !== undefined ? slugifyImageName(updates.name) : slugifyImageName(currentSlug);
  const nextFileName = `${nextSlug}${suffix}`;

  const fromPath = path;
  const toPath = `${RESOURCES_ROOT}/${targetFolder}/${nextFileName}`;

  if (fromPath !== toPath) {
    const { error } = await bucket().move(fromPath, toPath);
    if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
  }

  return toImageInfo(targetFolder, nextFileName, new Date().toISOString());
}

export async function deleteResourceImage(path: string): Promise<void> {
  const segments = path.split('/');
  if (segments[0] !== RESOURCES_ROOT || segments.length !== 3) {
    fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Đường dẫn ảnh không hợp lệ');
  }

  const { error } = await bucket().remove([path]);
  if (error) fail('STORAGE_ERROR', HttpStatusCode.INTERNAL_SERVER_ERROR, error.message);
}

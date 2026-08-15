import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { handleRouteError } from '@/lib/utils';
import { isUploadFile } from '@/lib/utils/upload-image';
import {
  deleteResourceImage,
  listResourceImages,
  updateResourceImage,
  uploadResourceImage,
} from '@/lib/utils/resource-storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await listResourceImages(searchParams.get('folder'));
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_IMAGE_LIST_FAILED');
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Payload không hợp lệ');
    }

    const imageEntry = formData.get('image');
    if (!isUploadFile(imageEntry)) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Thiếu ảnh');
    }

    const folder = String(formData.get('folder') ?? '').trim();
    if (!folder) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Thiếu folder');
    }

    const name = formData.get('name');
    const data = await uploadResourceImage(imageEntry, folder, name ? String(name) : undefined);
    return NextResponse.json({ data }, { status: HttpStatusCode.CREATED });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_IMAGE_CREATE_FAILED');
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === 'string' ? body.path : '';
    if (!path) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Thiếu đường dẫn ảnh');
    }

    const data = await updateResourceImage(path, {
      name: typeof body?.name === 'string' || body?.name === null ? body.name : undefined,
      folder: typeof body?.folder === 'string' ? body.folder : undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_IMAGE_UPDATE_FAILED');
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    if (!path) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Thiếu đường dẫn ảnh');
    }

    await deleteResourceImage(path);
    return NextResponse.json({ data: { path } });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_IMAGE_DELETE_FAILED');
  }
}

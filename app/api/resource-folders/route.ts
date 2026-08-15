import { NextResponse } from 'next/server';
import { fail } from '@/errors';
import { HttpStatusCode } from '@/constants/enums';
import { handleRouteError } from '@/lib/utils';
import {
  createResourceFolder,
  deleteResourceFolder,
  listResourceFolders,
  renameResourceFolder,
} from '@/lib/utils/resource-storage';
import { z } from '@/lib/validators';

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Tên folder là bắt buộc')
  .max(100, 'Tên folder quá dài');

export async function GET() {
  try {
    const data = await listResourceFolders();
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_FOLDER_LIST_FAILED');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = nameSchema.safeParse(body?.name);
    if (!parsed.success) {
      fail(
        'VALIDATION_ERROR',
        HttpStatusCode.BAD_REQUEST,
        parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      );
    }

    const data = await createResourceFolder(parsed.data);
    return NextResponse.json({ data }, { status: HttpStatusCode.CREATED });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_FOLDER_CREATE_FAILED');
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const nameParsed = nameSchema.safeParse(body?.name);
    const newNameParsed = nameSchema.safeParse(body?.newName);
    if (!nameParsed.success || !newNameParsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Dữ liệu không hợp lệ');
    }

    const data = await renameResourceFolder(nameParsed.data, newNameParsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_FOLDER_UPDATE_FAILED');
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = nameSchema.safeParse(searchParams.get('name'));
    if (!parsed.success) {
      fail('VALIDATION_ERROR', HttpStatusCode.BAD_REQUEST, 'Tên folder không hợp lệ');
    }

    await deleteResourceFolder(parsed.data);
    return NextResponse.json({ data: { name: parsed.data } });
  } catch (error) {
    return handleRouteError(error, 'RESOURCE_FOLDER_DELETE_FAILED');
  }
}

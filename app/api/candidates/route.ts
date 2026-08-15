import { NextResponse } from 'next/server';
import { listCandidateRecords } from '@/lib/lark/candidates';
import { handleRouteError } from '@/lib/utils';

const COLUMN_PRIORITY = ['Tên ứng viên', 'Điện thoại', 'Email', 'NGÀY NHẬN VIỆC', 'Ghi chú'];

const HIDDEN_COLUMNS = new Set([
  'CV',
  'Giới tính',
  'Bằng cấp',
  'Khu vực',
  'Parent items',
  'Sơ loại',
  'Tuổi',
  'Nghi chú',
  'Lý do rớt sơ loại',
  'Nơi phỏng vấn',
  'Kinh nghiệm',
  'Tài liệu',
  'Mức lương',
  'NGAY PV',
  'Đã phỏng vấn',
  'Ngày nhận việc',
]);

export async function GET() {
  try {
    const records = await listCandidateRecords();

    const columns: string[] = [];
    const seen = new Set<string>();
    for (const record of records) {
      for (const key of Object.keys(record.fields)) {
        if (!seen.has(key) && !HIDDEN_COLUMNS.has(key)) {
          seen.add(key);
          columns.push(key);
        }
      }
    }

    columns.sort((a, b) => {
      const aIndex = COLUMN_PRIORITY.indexOf(a);
      const bIndex = COLUMN_PRIORITY.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return NextResponse.json({ data: records, columns });
  } catch (error) {
    return handleRouteError(error, 'CANDIDATES_LIST_FAILED');
  }
}

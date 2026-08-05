import { z } from 'zod';

const emptyToNull = (value: unknown) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
};

const optionalText = z.preprocess(emptyToNull, z.string().trim().nullable().optional());

const optionalRate = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return value;
}, z.coerce.number().min(1, 'Đánh giá từ 1–5').max(5, 'Đánh giá từ 1–5').nullable().optional());

export const recruitmentGroupIdSchema = z.coerce.number().int().positive('ID không hợp lệ');

export const createRecruitmentGroupSchema = z.object({
  name: z.string().trim().min(1, 'Tên nhóm là bắt buộc'),
  category: optionalText,
  group_id: optionalText,
  rate: optionalRate,
  link: optionalText,
  note: optionalText,
});

export const updateRecruitmentGroupSchema = createRecruitmentGroupSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Không có dữ liệu để cập nhật' },
);

export type CreateRecruitmentGroupInput = z.infer<typeof createRecruitmentGroupSchema>;
export type UpdateRecruitmentGroupInput = z.infer<typeof updateRecruitmentGroupSchema>;

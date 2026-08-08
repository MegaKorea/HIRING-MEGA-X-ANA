import { z } from 'zod';
import {
  RECRUITMENT_CATEGORIES,
  type RecruitmentCategory,
} from '@/constants/recruitment-categories';
import { emptyToNull, optionalBoolean, optionalTimestamp } from '@/lib/validators';

const optionalText = z.preprocess(emptyToNull, z.string().trim().nullable().optional());

const optionalCategory = z.preprocess(
  emptyToNull,
  z.enum(RECRUITMENT_CATEGORIES).nullable().optional(),
);

const optionalRate = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return value;
}, z.coerce.number().min(1, 'Đánh giá từ 1–5').max(5, 'Đánh giá từ 1–5').nullable().optional());

const optionalCooldown = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return undefined;
  return value;
}, z.coerce.number().int().min(0, 'Cooldown phải ≥ 0').optional());

export const recruitmentGroupIdSchema = z.coerce.number().int().positive('ID không hợp lệ');

export const createRecruitmentGroupSchema = z.object({
  name: z.string().trim().min(1, 'Tên nhóm là bắt buộc'),
  category: optionalCategory,
  group_id: optionalText,
  rate: optionalRate,
  note: optionalText,
  is_active: optionalBoolean,
  cooldown_minutes: optionalCooldown,
  last_posted_at: optionalTimestamp,
});

export const updateRecruitmentGroupSchema = createRecruitmentGroupSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Không có dữ liệu để cập nhật' },
);

export const markRecruitmentGroupPostedSchema = z.object({
  last_posted_at: z.string().datetime().optional(),
});

export type CreateRecruitmentGroupInput = z.infer<typeof createRecruitmentGroupSchema>;
export type UpdateRecruitmentGroupInput = z.infer<typeof updateRecruitmentGroupSchema>;
export type MarkRecruitmentGroupPostedInput = z.infer<typeof markRecruitmentGroupPostedSchema>;
export type { RecruitmentCategory };

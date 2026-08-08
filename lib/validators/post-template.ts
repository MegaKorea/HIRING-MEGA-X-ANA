import { z } from 'zod';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { isHtmlContentEmpty } from '@/lib/utils/html-content';
import {
  booleanQueryParam,
  emptyToNull,
  optionalBoolean,
  optionalTimestamp,
  paginationSchema,
} from '@/lib/validators';

const optionalText = z.preprocess(emptyToNull, z.string().trim().nullable().optional());

export const postTemplateIdSchema = z.coerce.number().int().positive('ID không hợp lệ');

export const createPostTemplateSchema = z.object({
  category: z.enum(RECRUITMENT_CATEGORIES, { error: 'Danh mục không hợp lệ' }),
  content: z
    .string()
    .trim()
    .refine((value) => !isHtmlContentEmpty(value), 'Nội dung là bắt buộc'),
  image_url: z.string().trim().optional().default(''),
  is_active: optionalBoolean,
  last_posted_at: optionalTimestamp,
  note: optionalText,
});

export const updatePostTemplateSchema = createPostTemplateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Không có dữ liệu để cập nhật' },
);

export const postTemplateListQuerySchema = paginationSchema.extend({
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  is_active: booleanQueryParam,
});

export type CreatePostTemplateInput = z.infer<typeof createPostTemplateSchema>;
export type UpdatePostTemplateInput = z.infer<typeof updatePostTemplateSchema>;
export type PostTemplateListQuery = z.infer<typeof postTemplateListQuerySchema>;

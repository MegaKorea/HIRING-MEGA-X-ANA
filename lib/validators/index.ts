import { z } from 'zod';

export { z };

export const emailSchema = z.string().trim().email('Email không hợp lệ');

export const uuidSchema = z.string().uuid('ID không hợp lệ');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const UNCATEGORIZED_FILTER = '__uncategorized__';

export const recruitmentGroupListQuerySchema = paginationSchema.extend({
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type RecruitmentGroupListQuery = z.infer<typeof recruitmentGroupListQuerySchema>;

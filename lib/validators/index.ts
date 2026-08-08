import { z } from 'zod';

export { z };

export const emailSchema = z.string().trim().email('Email không hợp lệ');

export const uuidSchema = z.string().uuid('ID không hợp lệ');

/** Zod preprocess helper: turns `undefined`/`null`/blank strings into `null` (empty stays optional). */
export const emptyToNull = (value: unknown) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
};

/** Accepts real booleans or the string/number forms form-data & query params send. */
export const optionalBoolean = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return undefined;
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return value;
}, z.boolean().optional());

export const optionalTimestamp = z.preprocess(emptyToNull, z.string().datetime().nullable().optional());

/** `?flag=true`/`?flag=false` query-string param → optional boolean. */
export const booleanQueryParam = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === 'true'));

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
  is_active: booleanQueryParam,
});

export type RecruitmentGroupListQuery = z.infer<typeof recruitmentGroupListQuerySchema>;

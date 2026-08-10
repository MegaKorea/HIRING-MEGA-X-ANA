import { z } from 'zod';
import { booleanQueryParam, paginationSchema } from '@/lib/validators';

export const postLogListQuerySchema = paginationSchema.extend({
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  ok: booleanQueryParam,
  q: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type PostLogListQuery = z.infer<typeof postLogListQuerySchema>;

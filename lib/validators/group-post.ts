import { z } from 'zod';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { isHtmlContentEmpty } from '@/lib/utils/html-content';

export const groupPostSchema = z.object({
  content: z
    .string()
    .trim()
    .refine((value) => !isHtmlContentEmpty(value), 'Nội dung bài đăng là bắt buộc'),
  category: z.enum(RECRUITMENT_CATEGORIES, {
    error: 'Danh mục không hợp lệ',
  }),
  image_url: z.string().optional().default(''),
});

export type GroupPostInput = z.infer<typeof groupPostSchema>;

export type GroupPostWebhookPayload = {
  content: string;
  image_url: string;
  category: string;
  group_ids: string[];
  type: 'group_post';
};

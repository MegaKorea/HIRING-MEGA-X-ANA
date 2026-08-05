import { z } from 'zod';

export const groupPostSchema = z.object({
  content: z.string().trim().min(1, 'Nội dung bài đăng là bắt buộc'),
  category: z.string().trim().min(1, 'Danh mục là bắt buộc'),
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

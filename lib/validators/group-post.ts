import { z } from 'zod';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { isHtmlContentEmpty } from '@/lib/utils/html-content';

export const groupPostSchema = z
  .object({
    content: z.string().trim().default(''),
    category: z.enum(RECRUITMENT_CATEGORIES, {
      error: 'Danh mục không hợp lệ',
    }),
    image_url: z.string().optional().default(''),
    /** Bỏ trống content — n8n bốc ngẫu nhiên từ post_template của danh mục. */
    random_content: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((value) => value === true || value === 'true' || value === '1'),
  })
  .refine(
    (data) => data.random_content || !isHtmlContentEmpty(data.content),
    { path: ['content'], message: 'Nội dung bài đăng là bắt buộc' },
  );

export type GroupPostInput = z.infer<typeof groupPostSchema>;

/** Một lựa chọn content gửi sang n8n. Nhiều phần tử = n8n random theo từng nhóm. */
export type GroupPostContent = {
  template_id: number | null;
  content: string;
  image_url: string;
};

export type GroupPostWebhookPayload = {
  run_id: string;
  category: string;
  group_ids: string[];
  contents: GroupPostContent[];
  type: 'group_post';
};

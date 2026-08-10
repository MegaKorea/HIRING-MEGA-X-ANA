'use client';

import { PageHeader } from '@/components/common';
import { PostTemplatesPanel } from '@/features/post-templates/components/PostTemplatesPanel';

export default function PostContentPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Content"
        description="Quản lý nội dung + ảnh mẫu để dùng khi soạn bài đăng."
      />
      <PostTemplatesPanel />
    </div>
  );
}

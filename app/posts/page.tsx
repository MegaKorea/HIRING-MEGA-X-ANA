'use client';

import { PageHeader } from '@/components/common';
import { GroupPostForm } from '@/features/group-posts/components/GroupPostForm';

export default function PostsPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Đăng bài"
        description="Soạn nội dung và chọn danh mục để đăng tự động lên các nhóm Facebook tương ứng."
      />
      <GroupPostForm />
    </div>
  );
}

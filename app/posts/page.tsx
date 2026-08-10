'use client';

import { PageHeader } from '@/components/common';
import { GroupPostForm } from '@/features/group-posts/components/GroupPostForm';

export default function ComposePostPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Soạn bài"
        description="Soạn nội dung, chọn danh mục và đăng lên các nhóm."
      />
      <GroupPostForm />
    </div>
  );
}

'use client';

import { PageHeader } from '@/components/common';
import { GroupPostForm } from '@/features/group-posts/components/GroupPostForm';
import { PostsNav } from '@/features/group-posts/components/PostsNav';

export default function ComposePostPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Soạn bài"
        description="Soạn nội dung, chọn danh mục và đăng lên các nhóm."
        actions={<PostsNav />}
      />
      <GroupPostForm />
    </div>
  );
}

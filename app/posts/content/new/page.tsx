'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingState, PageHeader } from '@/components/common';
import { TemplateForm } from '@/features/post-templates/components/TemplateForm';

function NewTemplateForm() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category');
  return <TemplateForm defaultCategory={defaultCategory} />;
}

export default function NewPostTemplatePage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Thêm content"
        description="Soạn nội dung + ảnh mẫu để dùng khi soạn bài đăng."
      />
      <Suspense fallback={<LoadingState tip="Đang tải form..." />}>
        <NewTemplateForm />
      </Suspense>
    </div>
  );
}

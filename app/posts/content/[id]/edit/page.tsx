'use client';

import { use } from 'react';
import { FileText } from 'lucide-react';
import { EmptyState, LoadingState, PageHeader } from '@/components/common';
import { TemplateForm } from '@/features/post-templates/components/TemplateForm';
import { usePostTemplate } from '@/features/post-templates/hooks';
import { getErrorMessage } from '@/lib/utils';

type EditPostTemplatePageProps = {
  params: Promise<{ id: string }>;
};

export default function EditPostTemplatePage({ params }: EditPostTemplatePageProps) {
  const { id: rawId } = use(params);
  const id = Number(rawId);
  const {
    data: template,
    isLoading,
    isError,
    error,
    refetch,
  } = usePostTemplate(Number.isFinite(id) && id > 0 ? id : null);

  return (
    <div className="min-w-0">
      <PageHeader title="Sửa content" description="Cập nhật nội dung + ảnh mẫu." />

      {isLoading ? <LoadingState tip="Đang tải content..." /> : null}

      {!isLoading && (isError || !template) ? (
        <EmptyState
          image={<FileText className="size-6" />}
          title="Không tải được content"
          description={getErrorMessage(error, 'Content không tồn tại hoặc đã bị xóa.')}
          actionLabel="Thử lại"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && template ? <TemplateForm key={template.id} template={template} /> : null}
    </div>
  );
}

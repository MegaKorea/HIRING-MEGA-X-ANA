'use client';

import { Suspense, useState } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { Images } from 'lucide-react';
import { EmptyState, LoadingState, PageHeader } from '@/components/common';
import { EditResourceImageDialog } from '@/features/resources/components/EditResourceImageDialog';
import { FolderSidebar } from '@/features/resources/components/FolderSidebar';
import { ResourceGrid } from '@/features/resources/components/ResourceGrid';
import { UploadResourceDialog } from '@/features/resources/components/UploadResourceDialog';
import { useResourceImages } from '@/features/resources/hooks';
import type { ResourceImage } from '@/features/resources/api';
import { getErrorMessage } from '@/lib/utils';

function ResourcesPageContent() {
  const [folder, setFolder] = useQueryState('folder', parseAsString);
  const [editing, setEditing] = useState<ResourceImage | null>(null);

  const { data: images, isLoading, isError, error, refetch } = useResourceImages(folder);

  return (
    <div>
      <PageHeader
        title="Tài nguyên"
        description="Thư viện ảnh tuyển dụng."
        actions={<UploadResourceDialog defaultFolder={folder} />}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <FolderSidebar selectedName={folder} onSelect={(next) => void setFolder(next)} />

        <div className="min-w-0 flex-1">
          {isLoading ? <LoadingState tip="Đang tải ảnh..." /> : null}

          {!isLoading && isError ? (
            <EmptyState
              image={<Images className="size-6" />}
              title="Không tải được dữ liệu"
              description={getErrorMessage(error, 'Đã xảy ra lỗi khi tải ảnh.')}
              actionLabel="Thử lại"
              onAction={() => {
                void refetch();
              }}
            />
          ) : null}

          {!isLoading && !isError && (images?.length ?? 0) === 0 ? (
            <EmptyState
              image={<Images className="size-6" />}
              title="Chưa có ảnh"
              description="Tải ảnh tuyển dụng đầu tiên lên để bắt đầu."
            />
          ) : null}

          {!isLoading && !isError && images && images.length > 0 ? (
            <ResourceGrid images={images} onEdit={setEditing} />
          ) : null}
        </div>
      </div>

      <EditResourceImageDialog
        image={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<LoadingState tip="Đang tải ảnh..." />}>
      <ResourcesPageContent />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, UsersRound } from 'lucide-react';
import { EmptyState, LoadingState, PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { GroupForm } from '@/features/recruitment-groups/components/GroupForm';
import { useRecruitmentGroup } from '@/features/recruitment-groups/hooks';
import { getErrorMessage } from '@/lib/utils';

type EditGroupPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditGroupPage({ params }: EditGroupPageProps) {
  const { id: rawId } = use(params);
  const id = Number(rawId);
  const { data: group, isLoading, isError, error, refetch } = useRecruitmentGroup(
    Number.isFinite(id) && id > 0 ? id : null,
  );

  return (
    <div className="min-w-0">
      <PageHeader
        title="Sửa nhóm"
        description="Cập nhật thông tin nhóm tuyển dụng."
        actions={
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/groups">
              <ArrowLeft data-icon="inline-start" />
              Quay lại
            </Link>
          </Button>
        }
      />

      {isLoading ? <LoadingState tip="Đang tải nhóm..." /> : null}

      {!isLoading && (isError || !group) ? (
        <EmptyState
          image={<UsersRound className="size-6" />}
          title="Không tải được nhóm"
          description={getErrorMessage(error, 'Nhóm không tồn tại hoặc đã bị xóa.')}
          actionLabel="Thử lại"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && group ? <GroupForm key={group.id} group={group} /> : null}
    </div>
  );
}

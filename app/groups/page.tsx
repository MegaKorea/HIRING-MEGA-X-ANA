'use client';

import { useEffect, useState } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { Plus, UsersRound } from 'lucide-react';
import { EmptyState, LoadingState, PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { DeleteGroupDialog } from '@/features/recruitment-groups/components/DeleteGroupDialog';
import { GroupFormDialog } from '@/features/recruitment-groups/components/GroupFormDialog';
import { GroupsCategoryFilter } from '@/features/recruitment-groups/components/GroupsCategoryFilter';
import { GroupsPagination } from '@/features/recruitment-groups/components/GroupsPagination';
import { GroupsTable } from '@/features/recruitment-groups/components/GroupsTable';
import { RECRUITMENT_GROUPS_PAGE_SIZE } from '@/features/recruitment-groups/api';
import { useRecruitmentGroups } from '@/features/recruitment-groups/hooks';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';
import { getErrorMessage } from '@/lib/utils';

export default function GroupsPage() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  );
  const categoryFilter = category || null;

  const { data, isLoading, isError, error, refetch, isFetching } = useRecruitmentGroups(
    page,
    RECRUITMENT_GROUPS_PAGE_SIZE,
    categoryFilter,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RecruitmentGroup | null>(null);
  const [deleting, setDeleting] = useState<RecruitmentGroup | null>(null);

  const groups = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;
  const categories = meta?.categories ?? [];
  const hasUncategorized = meta?.hasUncategorized ?? false;
  const hasFilter = !!categoryFilter;
  const showFilter = categories.length > 0 || hasUncategorized || hasFilter;

  useEffect(() => {
    if (!meta) return;
    if (page > meta.totalPages) {
      void setPage(meta.totalPages);
    }
  }, [meta, page, setPage]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(group: RecruitmentGroup) {
    setEditing(group);
    setFormOpen(true);
  }

  async function handleCategoryChange(next: string | null) {
    await setCategory(next ?? '');
    await setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Danh sách nhóm"
        description="Quản lý các nhóm tuyển dụng trong hệ thống."
        actions={
          <>
            {showFilter ? (
              <GroupsCategoryFilter
                value={categoryFilter}
                categories={categories}
                hasUncategorized={hasUncategorized}
                onChange={handleCategoryChange}
                disabled={isLoading}
              />
            ) : null}
            <Button onClick={openCreate} className="w-full sm:w-auto">
              <Plus data-icon="inline-start" />
              Thêm nhóm
            </Button>
          </>
        }
      />

      {isLoading ? <LoadingState tip="Đang tải danh sách nhóm..." /> : null}

      {!isLoading && isError ? (
        <EmptyState
          image={<UsersRound className="size-6" />}
          title="Không tải được dữ liệu"
          description={getErrorMessage(error, 'Đã xảy ra lỗi khi tải danh sách nhóm.')}
          actionLabel="Thử lại"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && total === 0 && !hasFilter ? (
        <EmptyState
          image={<UsersRound className="size-6" />}
          title="Chưa có nhóm"
          description="Tạo nhóm đầu tiên để phân loại quy trình tuyển dụng."
          actionLabel="Thêm nhóm"
          onAction={openCreate}
        />
      ) : null}

      {!isLoading && !isError && total === 0 && hasFilter ? (
        <EmptyState
          image={<UsersRound className="size-6" />}
          title="Không có nhóm phù hợp"
          description="Không tìm thấy nhóm thuộc danh mục đã chọn. Thử danh mục khác."
          actionLabel="Xóa bộ lọc"
          onAction={() => {
            void handleCategoryChange(null);
          }}
        />
      ) : null}

      {!isLoading && !isError && groups.length > 0 ? (
        <div className={isFetching ? 'opacity-70 transition-opacity' : undefined}>
          <GroupsTable groups={groups} onEdit={openEdit} onDelete={setDeleting} />
          <GroupsPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={RECRUITMENT_GROUPS_PAGE_SIZE}
            onPageChange={(next) => {
              void setPage(next);
            }}
          />
        </div>
      ) : null}

      <GroupFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        group={editing}
      />

      <DeleteGroupDialog
        group={deleting}
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </div>
  );
}

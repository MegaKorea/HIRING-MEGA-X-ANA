'use client';

import { Suspense, useEffect, useState } from 'react';
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { History } from 'lucide-react';
import { EmptyState, LoadingState, PageHeader } from '@/components/common';
import { POST_LOG_PAGE_SIZE } from '@/features/post-log/api';
import { PostLogFilters } from '@/features/post-log/components/PostLogFilters';
import { PostLogPagination } from '@/features/post-log/components/PostLogPagination';
import { PostLogTable } from '@/features/post-log/components/PostLogTable';
import { usePostLog } from '@/features/post-log/hooks';
import { getErrorMessage } from '@/lib/utils';

function PostHistoryPageContent() {
  const [{ page, category, status }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    category: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    status: parseAsBoolean,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      void setQuery({ page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, setQuery]);

  const categoryFilter = category || null;
  const hasFilter = !!categoryFilter || status !== null || !!debouncedSearch;

  const { data, isLoading, isError, error, refetch, isFetching } = usePostLog(
    page,
    categoryFilter,
    status,
    debouncedSearch || null,
  );

  const logs = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  useEffect(() => {
    if (!meta) return;
    if (page > meta.totalPages) {
      void setQuery({ page: meta.totalPages });
    }
  }, [meta, page, setQuery]);

  function clearFilters() {
    setSearch('');
    setDebouncedSearch('');
    void setQuery({ category: '', status: null, page: 1 });
  }

  return (
    <div>
      <PageHeader
        title="Lịch sử đăng bài"
        description="Theo dõi các lượt đăng bài vào nhóm — trạng thái, nội dung và lỗi (nếu có)."
      />

      <div className="mb-4">
        <PostLogFilters
          category={categoryFilter}
          onCategoryChange={(next) => void setQuery({ category: next ?? '', page: 1 })}
          status={status}
          onStatusChange={(next) => void setQuery({ status: next, page: 1 })}
          search={search}
          onSearchChange={setSearch}
          disabled={isLoading}
        />
      </div>

      {isLoading ? <LoadingState tip="Đang tải lịch sử đăng bài..." /> : null}

      {!isLoading && isError ? (
        <EmptyState
          image={<History className="size-6" />}
          title="Không tải được dữ liệu"
          description={getErrorMessage(error, 'Đã xảy ra lỗi khi tải lịch sử đăng bài.')}
          actionLabel="Thử lại"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && total === 0 && !hasFilter ? (
        <EmptyState
          image={<History className="size-6" />}
          title="Chưa có lịch sử"
          description="Khi bạn đăng bài vào nhóm, kết quả sẽ hiện tại đây."
        />
      ) : null}

      {!isLoading && !isError && total === 0 && hasFilter ? (
        <EmptyState
          image={<History className="size-6" />}
          title="Không có kết quả phù hợp"
          description="Không tìm thấy lượt đăng nào khớp bộ lọc. Thử điều kiện khác."
          actionLabel="Xóa bộ lọc"
          onAction={clearFilters}
        />
      ) : null}

      {!isLoading && !isError && logs.length > 0 ? (
        <div className={isFetching ? 'opacity-70 transition-opacity' : undefined}>
          <PostLogTable logs={logs} />
          <PostLogPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={POST_LOG_PAGE_SIZE}
            onPageChange={(next) => {
              void setQuery({ page: next });
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function PostHistoryPage() {
  return (
    <Suspense fallback={<LoadingState tip="Đang tải lịch sử đăng bài..." />}>
      <PostHistoryPageContent />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { IdCard } from 'lucide-react';
import { EmptyState, LoadingState, PageHeader, Pagination } from '@/components/common';
import type { CandidateRecord } from '@/features/candidates/api';
import { CandidatesDateFilter } from '@/features/candidates/components/CandidatesDateFilter';
import { CandidatesTable } from '@/features/candidates/components/CandidatesTable';
import { useCandidates } from '@/features/candidates/hooks';
import { getErrorMessage } from '@/lib/utils';

const CANDIDATES_PAGE_SIZE = 20;
const DATE_FIELD = 'Ngày';

function todayDateString(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
}

function matchesDateRange(record: CandidateRecord, from: string, to: string): boolean {
  if (!from && !to) return true;
  const raw = record.fields[DATE_FIELD];
  if (typeof raw !== 'number') return false;
  const value = new Date(raw).toISOString().slice(0, 10);
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
}

function CandidatesPageContent() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [dateFrom, setDateFrom] = useQueryState(
    'from',
    parseAsString.withDefault(todayDateString()).withOptions({ clearOnDefault: true }),
  );
  const [dateTo, setDateTo] = useQueryState(
    'to',
    parseAsString.withDefault(todayDateString()).withOptions({ clearOnDefault: true }),
  );
  const { data, isLoading, isError, error, refetch } = useCandidates();
  const columns = data?.columns ?? [];
  const records = (data?.data ?? []).filter((record) => matchesDateRange(record, dateFrom, dateTo));
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / CANDIDATES_PAGE_SIZE));
  const pageRecords = records.slice((page - 1) * CANDIDATES_PAGE_SIZE, page * CANDIDATES_PAGE_SIZE);
  const hasFilter = !!dateFrom || !!dateTo;

  useEffect(() => {
    if (total > 0 && page > totalPages) {
      void setPage(totalPages);
    }
  }, [total, page, totalPages, setPage]);

  function handleDateChange({ from, to }: { from: string | null; to: string | null }) {
    void setDateFrom(from ?? '');
    void setDateTo(to ?? '');
    void setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Hồ sơ ứng viên"
        description="Danh sách ứng viên."
        actions={
          <CandidatesDateFilter
            from={dateFrom || null}
            to={dateTo || null}
            onChange={handleDateChange}
            disabled={isLoading}
          />
        }
      />

      {isLoading ? <LoadingState tip="Đang tải danh sách ứng viên..." /> : null}

      {!isLoading && isError ? (
        <EmptyState
          image={<IdCard className="size-6" />}
          title="Không tải được dữ liệu"
          description={getErrorMessage(error, 'Đã xảy ra lỗi khi tải danh sách ứng viên.')}
          actionLabel="Thử lại"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && total === 0 && !hasFilter ? (
        <EmptyState
          image={<IdCard className="size-6" />}
          title="Chưa có ứng viên"
          description="Chưa có dữ liệu ứng viên trong bảng Lark Base."
        />
      ) : null}

      {!isLoading && !isError && total === 0 && hasFilter ? (
        <EmptyState
          image={<IdCard className="size-6" />}
          title="Không có ứng viên phù hợp"
          description="Không tìm thấy ứng viên trong khoảng ngày đã chọn. Thử khoảng ngày khác."
          actionLabel="Xóa bộ lọc"
          onAction={() => handleDateChange({ from: null, to: null })}
        />
      ) : null}

      {!isLoading && !isError && total > 0 ? (
        <div>
          <CandidatesTable records={pageRecords} columns={columns} />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={CANDIDATES_PAGE_SIZE}
            unitLabel="ứng viên"
            onPageChange={(next) => {
              void setPage(next);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<LoadingState tip="Đang tải danh sách ứng viên..." />}>
      <CandidatesPageContent />
    </Suspense>
  );
}

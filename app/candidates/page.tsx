'use client';

import { Plus } from 'lucide-react';
import { PlaceholderPage } from '@/components/common';
import { Button } from '@/components/ui/button';

export default function CandidatesPage() {
  return (
    <PlaceholderPage
      title="Ứng viên"
      description="Danh sách và pipeline ứng viên trong quy trình tuyển dụng."
      emptyTitle="Chưa có ứng viên"
      emptyDescription="Thêm ứng viên đầu tiên để bắt đầu pipeline."
      actions={
        <Button>
          <Plus data-icon="inline-start" />
          Thêm ứng viên
        </Button>
      }
    />
  );
}

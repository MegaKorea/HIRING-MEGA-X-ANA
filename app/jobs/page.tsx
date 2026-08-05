'use client';

import { Plus } from 'lucide-react';
import { PlaceholderPage } from '@/components/common';
import { Button } from '@/components/ui/button';

export default function JobsPage() {
  return (
    <PlaceholderPage
      title="Tin tuyển dụng"
      description="Quản lý các vị trí đang mở và vòng tuyển."
      emptyTitle="Chưa có tin tuyển dụng"
      emptyDescription="Tạo tin mới để bắt đầu nhận ứng viên."
      actions={
        <Button>
          <Plus data-icon="inline-start" />
          Tạo tin
        </Button>
      }
    />
  );
}

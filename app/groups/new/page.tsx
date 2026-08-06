'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { GroupForm } from '@/features/recruitment-groups/components/GroupForm';

export default function NewGroupPage() {
  return (
    <div className="min-w-0">
      <PageHeader
        title="Thêm nhóm"
        description="Nhập thông tin để tạo nhóm tuyển dụng mới."
        actions={
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/groups">
              <ArrowLeft data-icon="inline-start" />
              Quay lại
            </Link>
          </Button>
        }
      />
      <GroupForm />
    </div>
  );
}

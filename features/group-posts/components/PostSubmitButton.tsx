'use client';

import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PostSubmitButtonProps = {
  submitting: boolean;
  disabled: boolean;
  className?: string;
  fullWidth?: boolean;
};

export function PostSubmitButton({
  submitting,
  disabled,
  className,
  fullWidth,
}: PostSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(fullWidth && 'w-full', className)}
      disabled={disabled}
    >
      {submitting ? (
        <>
          <Loader2 data-icon="inline-start" className="animate-spin" />
          Đang gửi...
        </>
      ) : (
        <>
          <Send data-icon="inline-start" />
          Đăng bài
        </>
      )}
    </Button>
  );
}

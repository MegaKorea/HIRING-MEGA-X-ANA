'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ExpandableTextProps = {
  text: string;
  className?: string;
};

export function ExpandableText({ text, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  return (
    <div className="min-w-0">
      <p
        ref={ref}
        className={cn(
          'min-w-0 wrap-anywhere whitespace-pre-wrap text-sm leading-relaxed text-foreground',
          !expanded && 'line-clamp-3',
          className,
        )}
      >
        {text}
      </p>
      {overflowing || expanded ? (
        <button
          type="button"
          className="mt-1 cursor-pointer text-xs font-medium text-primary hover:underline"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      ) : null}
    </div>
  );
}

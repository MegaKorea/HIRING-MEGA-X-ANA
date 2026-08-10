'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';

const ALL_VALUE = '__all__';

type PostLogFiltersProps = {
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  status: boolean | null;
  onStatusChange: (status: boolean | null) => void;
  search: string;
  onSearchChange: (search: string) => void;
  disabled?: boolean;
};

export function PostLogFilters({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  search,
  onSearchChange,
  disabled,
}: PostLogFiltersProps) {
  const statusValue = status === null ? ALL_VALUE : String(status);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm bài theo nhóm hoặc id bài"
          className="bg-background pl-8"
        />
      </div>

      <Select
        value={category ?? ALL_VALUE}
        disabled={disabled}
        onValueChange={(value) => onCategoryChange(value === ALL_VALUE ? null : value)}
      >
        <SelectTrigger className="w-full bg-background sm:w-44">
          <SelectValue placeholder="Tất cả danh mục" />
        </SelectTrigger>
        <SelectContentPopper>
          <SelectItem value={ALL_VALUE}>Tất cả danh mục</SelectItem>
          {RECRUITMENT_CATEGORIES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContentPopper>
      </Select>

      <Select
        value={statusValue}
        disabled={disabled}
        onValueChange={(value) =>
          onStatusChange(value === ALL_VALUE ? null : value === 'true')
        }
      >
        <SelectTrigger className="w-full bg-background sm:w-40">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContentPopper>
          <SelectItem value={ALL_VALUE}>Tất cả trạng thái</SelectItem>
          <SelectItem value="true">Thành công</SelectItem>
          <SelectItem value="false">Thất bại</SelectItem>
        </SelectContentPopper>
      </Select>
    </div>
  );
}

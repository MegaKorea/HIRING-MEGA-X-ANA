'use client';

import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import { UNCATEGORIZED_FILTER } from '@/features/recruitment-groups/api';

const ALL_VALUE = '__all__';

type GroupsCategoryFilterProps = {
  value: string | null;
  onChange: (category: string | null) => void;
  disabled?: boolean;
};

export function GroupsCategoryFilter({
  value,
  onChange,
  disabled,
}: GroupsCategoryFilterProps) {
  const selectValue = value || ALL_VALUE;

  return (
    <Select
      value={selectValue}
      disabled={disabled}
      onValueChange={(next) => {
        onChange(!next || next === ALL_VALUE ? null : next);
      }}
    >
      <SelectTrigger className="w-full min-w-44 bg-background sm:w-52" size="default">
        <SelectValue placeholder="Tất cả danh mục" />
      </SelectTrigger>
      <SelectContentPopper align="end">
        <SelectItem value={ALL_VALUE}>Tất cả danh mục</SelectItem>
        <SelectItem value={UNCATEGORIZED_FILTER}>Chưa phân loại</SelectItem>
        {RECRUITMENT_CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContentPopper>
    </Select>
  );
}

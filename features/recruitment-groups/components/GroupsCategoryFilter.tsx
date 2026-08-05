'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UNCATEGORIZED_FILTER } from '@/features/recruitment-groups/api';

const ALL_VALUE = '__all__';

type GroupsCategoryFilterProps = {
  value: string | null;
  categories: string[];
  hasUncategorized?: boolean;
  onChange: (category: string | null) => void;
  disabled?: boolean;
};

export function GroupsCategoryFilter({
  value,
  categories,
  hasUncategorized = false,
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
      <SelectContent
        position="popper"
        side="bottom"
        align="end"
        sideOffset={6}
        avoidCollisions={false}
        className="max-h-72"
      >
        <SelectItem value={ALL_VALUE}>Tất cả danh mục</SelectItem>
        {hasUncategorized ? (
          <SelectItem value={UNCATEGORIZED_FILTER}>Chưa phân loại</SelectItem>
        ) : null}
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rating } from '@/components/ui/rating';
import {
  Select,
  SelectContentPopper,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RECRUITMENT_CATEGORIES } from '@/constants/recruitment-categories';
import {
  useCreateRecruitmentGroup,
  useUpdateRecruitmentGroup,
} from '@/features/recruitment-groups/hooks';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';
import type { CreateRecruitmentGroupInput } from '@/lib/validators/recruitment-group';
import { facebookGroupUrl, parseFacebookGroupId } from '@/lib/utils/facebook-group-id';

type FormState = {
  name: string;
  category: string;
  group_id: string;
  rate: string;
  note: string;
  is_active: boolean;
  cooldown_minutes: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  group_id: '',
  rate: '',
  note: '',
  is_active: true,
  cooldown_minutes: '1440',
};

function toFormState(group?: RecruitmentGroup | null): FormState {
  if (!group) return EMPTY_FORM;
  return {
    name: group.name ?? '',
    category: group.category ?? '',
    group_id: group.group_id ?? '',
    rate: group.rate != null ? String(group.rate) : '',
    note: group.note ?? '',
    is_active: group.is_active ?? true,
    cooldown_minutes: String(group.cooldown_minutes ?? 1440),
  };
}

function toPayload(form: FormState): CreateRecruitmentGroupInput {
  return {
    name: form.name,
    category: (form.category || null) as CreateRecruitmentGroupInput['category'],
    group_id: form.group_id ? parseFacebookGroupId(form.group_id) || null : null,
    rate: form.rate === '' ? null : Number(form.rate),
    note: form.note || null,
    is_active: form.is_active,
    cooldown_minutes: form.cooldown_minutes === '' ? 1440 : Number(form.cooldown_minutes),
  };
}

type GroupFormProps = {
  group?: RecruitmentGroup | null;
};

export function GroupForm({ group }: GroupFormProps) {
  const router = useRouter();
  const isEdit = !!group;
  const [form, setForm] = useState(() => toFormState(group));
  const createMutation = useCreateRecruitmentGroup();
  const updateMutation = useUpdateRecruitmentGroup();
  const submitting = createMutation.isPending || updateMutation.isPending;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goBack() {
    router.push('/groups');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = toPayload(form);
    const onSuccess = () => router.push('/groups');

    if (isEdit && group) {
      updateMutation.mutate({ id: group.id, input: payload }, { onSuccess });
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  }

  return (
    <form
      className="grid w-full min-w-0 gap-6 rounded-none border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6"
      onSubmit={handleSubmit}
    >
      {/* Thông tin chính */}
      <div className="grid min-w-0 gap-4">
        <div className="grid min-w-0 gap-2">
          <Label htmlFor="group-name">
            Tên nhóm <span className="text-destructive">*</span>
          </Label>
          <Input
            id="group-name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ví dụ: Marketing Hà Nội"
            required
            autoFocus
            className="h-10 md:h-9"
          />
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="group-category">
              Danh mục <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category}
              disabled={submitting}
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger
                id="group-category"
                className="h-10 w-full min-w-0 bg-background data-[size=default]:h-10 md:h-9 md:data-[size=default]:h-9"
              >
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContentPopper>
                {RECRUITMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContentPopper>
            </Select>
          </div>

          <div className="grid min-w-0 gap-2">
            <Label htmlFor="group-external-id">
              Group ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="group-external-id"
              value={form.group_id}
              onChange={(e) => updateField('group_id', parseFacebookGroupId(e.target.value))}
              placeholder="Dán Group ID"
              required
              className="h-10 min-w-0 md:h-9"
            />
            {form.group_id.trim() ? (
              <a
                href={facebookGroupUrl(form.group_id)}
                target="_blank"
                rel="noreferrer"
                className="truncate text-xs font-medium text-primary hover:underline"
              >
                {facebookGroupUrl(form.group_id)}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tuỳ chọn */}
      <div className="grid min-w-0 gap-4 border-t border-border pt-5">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div className="grid min-w-0 gap-2">
            <Label>Đánh giá</Label>
            <Rating
              rating={form.rate === '' ? 0 : Number(form.rate)}
              size="lg"
              editable
              onRatingChange={(value) => updateField('rate', String(value))}
            />
          </div>

          {isEdit ? (
            <div className="grid min-w-0 gap-2">
              <Label htmlFor="group-cooldown">Cooldown (phút)</Label>
              <Input
                id="group-cooldown"
                type="number"
                min={0}
                step={1}
                value={form.cooldown_minutes}
                onChange={(e) => updateField('cooldown_minutes', e.target.value)}
                placeholder="1440"
                className="h-10 md:h-9"
              />
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-none border border-border bg-muted/20 px-3 py-2.5">
          <div className="min-w-0">
            <Label htmlFor="group-active">Đang hoạt động</Label>
            <p className="text-xs text-muted-foreground">
              Tắt để loại nhóm này khỏi danh sách đăng bài.
            </p>
          </div>
          <Switch
            id="group-active"
            checked={form.is_active}
            onCheckedChange={(checked) => updateField('is_active', checked)}
          />
        </div>

        <div className="grid min-w-0 gap-2">
          <Label htmlFor="group-note">Ghi chú</Label>
          <Textarea
            id="group-note"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
            placeholder="Ghi chú thêm về nhóm..."
            rows={4}
            className="min-h-24 resize-y"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full sm:h-9 sm:w-auto"
          disabled={submitting}
          onClick={goBack}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="h-11 w-full sm:h-9 sm:w-auto"
          disabled={
            submitting || !form.name.trim() || !form.category.trim() || !form.group_id.trim()
          }
        >
          {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo nhóm'}
        </Button>
      </div>
    </form>
  );
}

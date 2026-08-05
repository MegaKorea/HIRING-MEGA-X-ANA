'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rating } from '@/components/ui/rating';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateRecruitmentGroup,
  useUpdateRecruitmentGroup,
} from '@/features/recruitment-groups/hooks';
import type { RecruitmentGroup } from '@/lib/supabase/types/tables';
import type { CreateRecruitmentGroupInput } from '@/lib/validators/recruitment-group';

type FormState = {
  name: string;
  category: string;
  group_id: string;
  rate: string;
  note: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  group_id: '',
  rate: '',
  note: '',
};

function toFormState(group?: RecruitmentGroup | null): FormState {
  if (!group) return EMPTY_FORM;
  return {
    name: group.name ?? '',
    category: group.category ?? '',
    group_id: group.group_id ?? '',
    rate: group.rate != null ? String(group.rate) : '',
    note: group.note ?? '',
  };
}

function toPayload(form: FormState): CreateRecruitmentGroupInput {
  return {
    name: form.name,
    category: form.category || null,
    group_id: form.group_id || null,
    rate: form.rate === '' ? null : Number(form.rate),
    note: form.note || null,
  };
}

type GroupFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: RecruitmentGroup | null;
};

type GroupFormBodyProps = {
  group?: RecruitmentGroup | null;
  onOpenChange: (open: boolean) => void;
};

function GroupFormBody({ group, onOpenChange }: GroupFormBodyProps) {
  const isEdit = !!group;
  const [form, setForm] = useState(() => toFormState(group));
  const createMutation = useCreateRecruitmentGroup();
  const updateMutation = useUpdateRecruitmentGroup();
  const submitting = createMutation.isPending || updateMutation.isPending;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = toPayload(form);

    if (isEdit && group) {
      await updateMutation.mutateAsync({ id: group.id, input: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Sửa nhóm' : 'Thêm nhóm'}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'Cập nhật thông tin nhóm tuyển dụng.'
            : 'Nhập thông tin để tạo nhóm tuyển dụng mới.'}
        </DialogDescription>
      </DialogHeader>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
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
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="group-category">Danh mục</Label>
            <Input
              id="group-category"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              placeholder="Marketing, Sale..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="group-external-id">Group ID</Label>
            <Input
              id="group-external-id"
              value={form.group_id}
              onChange={(e) => updateField('group_id', e.target.value)}
              placeholder="ID Facebook group"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Đánh giá</Label>
          <Rating
            rating={form.rate === '' ? 0 : Number(form.rate)}
            size="lg"
            editable
            onRatingChange={(value) => updateField('rate', String(value))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="group-note">Ghi chú</Label>
          <Textarea
            id="group-note"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
            placeholder="Ghi chú thêm..."
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={submitting || !form.name.trim()}
          >
            {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo nhóm'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function GroupFormDialog({ open, onOpenChange, group }: GroupFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90svh,40rem)] gap-4 overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        {open ? (
          <GroupFormBody
            key={group?.id ?? 'create'}
            group={group}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

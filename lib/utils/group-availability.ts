export type GroupAvailabilityMeta = {
  total_in_category: number;
  with_group_id: number;
  without_group_id: number;
  inactive_with_group_id: number;
};

/** Human-readable reason a category has no postable groups yet — shared by the client hint and the API error detail. */
export function describeGroupAvailability(meta?: GroupAvailabilityMeta | null): string {
  if (!meta) return 'Danh mục này chưa có Group ID để đăng.';
  if (meta.total_in_category === 0) {
    return 'Danh mục này chưa có nhóm nào trên Danh sách nhóm.';
  }
  if (meta.with_group_id === 0) {
    return `Có ${meta.total_in_category} nhóm nhưng chưa điền Group ID.`;
  }
  if (meta.inactive_with_group_id > 0) {
    return `Có ${meta.inactive_with_group_id} nhóm có Group ID nhưng đang tắt.`;
  }
  return 'Danh mục này chưa có Group ID để đăng.';
}

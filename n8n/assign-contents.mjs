// Logic phân content cho từng nhóm — bản gốc nằm trong node "Build Group List"
// của n8n/groups-auto.workflow.json. Sửa 1 nơi thì sửa cả 2.
// Chạy kiểm tra: node n8n/assign-contents.mjs

export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Bốc không hoàn lại: hết pool mới trộn lại.
 * → Với N nhóm và M content, mỗi content được dùng chênh nhau tối đa 1 lần,
 *   thay vì random độc lập có thể ra 5 nhóm liền cùng 1 bài (Facebook gắn cờ spam).
 */
export function assignContents(groupIds, contents, rand = Math.random) {
  let bag = [];
  return groupIds.map((gid) => {
    if (bag.length === 0) bag = shuffle(contents, rand);
    return { group_id: String(gid), ...bag.pop() };
  });
}

if (process.argv[1]?.endsWith('assign-contents.mjs')) {
  const { strict: assert } = await import('node:assert');

  const contents = [1, 2, 3].map((n) => ({ template_id: n, content: `c${n}`, image_url: '' }));
  const groups = Array.from({ length: 10 }, (_, i) => `g${i}`);
  const out = assignContents(groups, contents);

  assert.equal(out.length, 10);
  assert.ok(out.every((r) => r.content));

  // 10 nhóm / 3 content → mỗi content dùng 3 hoặc 4 lần, không dồn hết vào 1 bài.
  const counts = [...new Set(contents.map((c) => c.template_id))].map(
    (id) => out.filter((r) => r.template_id === id).length,
  );
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `phân bố lệch: ${counts}`);

  // Pool 1 content vẫn chạy được (chế độ content cố định).
  assert.equal(assignContents(groups, [contents[0]]).length, 10);

  console.log('assign-contents OK', counts);
}

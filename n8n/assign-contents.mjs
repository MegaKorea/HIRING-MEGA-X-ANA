// Content-assignment logic for each group — the source of truth lives in the
// "Build Group List" node of n8n/groups-auto.workflow.json. Edit one, edit both.
// Run the check: node n8n/assign-contents.mjs

export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw without replacement: reshuffle only once the pool is empty.
 * → With N groups and M content items, usage counts differ by at most 1,
 *   instead of independent random picks that could give 5 groups in a row
 *   the same post (Facebook flags that as spam).
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

  // 10 groups / 3 content items → each used 3 or 4 times, never all piled onto one.
  const counts = [...new Set(contents.map((c) => c.template_id))].map(
    (id) => out.filter((r) => r.template_id === id).length,
  );
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `uneven distribution: ${counts}`);

  // A pool of 1 content item still works (fixed-content mode).
  assert.equal(assignContents(groups, [contents[0]]).length, 10);

  console.log('assign-contents OK', counts);
}

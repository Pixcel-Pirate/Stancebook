// Run: node --experimental-strip-types scripts/talents.check.ts
import assert from "node:assert";
import fs from "node:fs";
import { canAdd, canRemove, change, decode, encode, fill, grandTotal, rankText } from "../src/lib/talent-rules.ts";
import type { Tree } from "../src/lib/talents.ts";
const T = (n: string, t: number, r: number, p?: string) => ({ n, t, c: 1, r, i: null, e: "", p });
const trees: Tree[] = [{ tree: "A", talents: [T("a", 1, 5), T("b", 2, 5), T("c", 3, 1), T("d", 4, 1, "c")] }];
const [a, b, c, d] = trees[0].talents;
let s = {};
assert(!canAdd(trees, s, 0, b), "tier 2 locked at 0 points");
s = fill(trees, s, 0, a, false);
assert(!canAdd(trees, s, 0, a), "shift-fill stops at max rank");
assert(canAdd(trees, s, 0, b), "tier 2 unlocked at 5");
s = change(s, 0, b, 1);
assert(!canRemove(trees, s, 0, a), "would orphan tier 2");
assert(canRemove(trees, s, 0, b), "top talent removable");
s = fill(trees, s, 0, b, false);
assert(canAdd(trees, s, 0, c)); s = change(s, 0, c, 1);
assert(canAdd(trees, s, 0, d) === false, "tier 4 needs 15 points");
assert(!canAdd(trees, s, 0, d, 9), "level cap");
assert.equal(encode(trees, s), "551");
assert.deepEqual(decode(trees, "551"), s, "link round-trips");
assert.equal(grandTotal(decode(trees, "9999")), 11, "decode clamps illegal links");
const pre: Tree[] = [{ tree: "P", talents: [T("x", 1, 2), T("y", 1, 1, "x")] }];
let q = change({}, 0, pre[0].talents[0], 1);
assert(!canAdd(pre, q, 0, pre[0].talents[1]), "prerequisite must be maxed");
q = change(change(q, 0, pre[0].talents[0], 1), 0, pre[0].talents[1], 1);
assert(!canRemove(pre, q, 0, pre[0].talents[0]), "can't unlearn a prerequisite in use");

// per-rank text: {rank 1|max} tokens, middle ranks interpolated
const rt = { n: "x", t: 1, c: 1, r: 5, i: null, e: "Parry +{1|5}%, {0.1|0.5} sec, {12|60} dmg." };
assert.equal(rankText(rt, 1), "Parry +1%, 0.1 sec, 12 dmg.");
assert.equal(rankText(rt, 3), "Parry +3%, 0.3 sec, 36 dmg.");
assert.equal(rankText(rt, 0), rankText(rt, 1), "unlearned shows rank 1");
assert.equal(rankText({ ...rt, r: 3, e: "{12|35}%" }, 2), "24%");

// shipped data: grid spots unique, prerequisites exist above or beside their dependent
for (const f of fs.readdirSync("src/data/talents")) {
  const data: Tree[] = JSON.parse(fs.readFileSync(`src/data/talents/${f}`, "utf8"));
  assert.equal(data.length, 3, f);
  for (const tr of data) {
    const spots = new Set(tr.talents.map((t) => `${t.t}.${t.c}`));
    assert.equal(spots.size, tr.talents.length, `${f} ${tr.tree} overlapping talents`);
    for (const t of tr.talents) {
      assert(/^[a-z0-9_]+$/.test(t.i ?? ""), `${f} ${t.n} needs a zamimg icon name`);
      assert(t.c >= 1 && t.c <= 4 && t.t >= 1 && t.t <= 7 && t.r >= 1 && t.r <= 5, `${f} ${t.n} out of grid`);
      assert(!/full rank|per rank/i.test(t.e), `${f} ${t.n} should list numbers per rank, not "at full rank"`);
      if (t.r === 1) assert(!t.e.includes("{"), `${f} ${t.n} has one rank but rank tokens`);
      assert(!/[{}]/.test(t.e.replace(/\{[\d.]+\|[\d.]+\}/g, "")), `${f} ${t.n} broken rank token`);
      const p = t.p && tr.talents.find((u) => u.n === t.p);
      if (t.p) assert(p && (p.t < t.t || (p.t === t.t && p.c < t.c)), `${f} ${t.n} prerequisite ${t.p}`);
    }
  }
}
console.log("talents ok");

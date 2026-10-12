// Run: node --experimental-strip-types scripts/talents.check.ts
import assert from "node:assert";
import { canAdd, canRemove, change } from "../src/lib/talent-rules.ts";
import type { Tree } from "../src/lib/talents.ts";
const T = (n: string, t: number, r: number) => ({ n, t, r, i: null, e: "", f: false });
const trees: Tree[] = [{ tree: "A", talents: [T("a", 1, 5), T("b", 2, 3)] }];
let s = {};
assert(!canAdd(trees, s, 0, trees[0].talents[1]), "tier 2 locked at 0 points");
for (let i = 0; i < 5; i++) s = change(s, 0, trees[0].talents[0], 1);
assert(!canAdd(trees, s, 0, trees[0].talents[0]), "max rank");
assert(canAdd(trees, s, 0, trees[0].talents[1]), "tier 2 unlocked at 5");
s = change(s, 0, trees[0].talents[1], 1);
assert(!canRemove(trees, s, 0, trees[0].talents[0]), "would orphan tier 2");
assert(canRemove(trees, s, 0, trees[0].talents[1]), "top talent removable");
console.log("talents ok");

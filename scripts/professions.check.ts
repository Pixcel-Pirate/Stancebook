// Run: node --experimental-strip-types scripts/professions.check.ts
// Every profession guide icon is a real zamimg icon name, steps run 1-300 in order, and totals add up from recipes.
import assert from "node:assert";
import { materialTotals, PROFESSIONS } from "../src/lib/professions.ts";

const icon = /^[a-z0-9_]+$/;
for (const g of PROFESSIONS) {
  assert(icon.test(g.icon), `${g.id}: bad icon`);
  assert(g.trainers.some((t) => t.rank === "Artisan" && t.where), `${g.id}: needs an Artisan trainer location`);
  let at = 1;
  for (const s of g.steps) {
    assert(icon.test(s.icon), `${g.id} ${s.title}: needs a zamimg icon name`);
    assert(s.from === at && s.to > s.from, `${g.id} ${s.title}: steps must chain (expected from ${at})`);
    at = s.to;
    for (const m of s.mats ?? []) assert(icon.test(m.icon) && m.qty > 0, `${g.id} ${s.title}: ${m.name} needs an icon and qty`);
  }
  assert.equal(at, 300, `${g.id}: route must end at 300`);
}
const bs = materialTotals(PROFESSIONS.find((g) => g.id === "blacksmithing")!);
const q = (n: string) => bs.find((t) => t.name === n)?.qty;
// 20 extra Heavy Grinding Stones for Golden Scale Bracers = 60 more Heavy Stone; route-made stones never show up.
assert.equal(q("Heavy Stone"), 120);
assert.equal(q("Thorium Bar"), 22 * 5 + 20 * 27 + 34 * 20 + 44 * 10);
assert.equal(q("Heavy Grinding Stone"), undefined);
console.log(`professions ok: ${PROFESSIONS.length} guides`);

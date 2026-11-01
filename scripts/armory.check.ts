// Run: node --experimental-strip-types scripts/armory.check.ts
// Every armory item must carry a real zamimg icon name, and only Classic-era items (Wowhead ids < 24000) are listed.
import assert from "node:assert";
import fs from "node:fs";
const { sets, weapons, bis, bisItems } = JSON.parse(fs.readFileSync("src/data/armory.json", "utf8"));
const icon = /^[a-z0-9_]+$/;
for (const s of sets) {
  assert(s.items.length > 0, `${s.name} has no pieces`);
  for (const p of s.items) assert(icon.test(p.i) && p.id > 0 && p.id < 24000, `${s.name}: ${p.n} needs a zamimg icon name and a Classic item id`);
}
for (const w of weapons) assert(icon.test(w.i) && w.id > 0 && w.id < 24000, `${w.n} needs a zamimg icon name and a Classic item id`);
assert(sets.some((s: { armor: string }) => s.armor === "plate") && weapons.some((w: { kind: string }) => w.kind === "Shield"));
// Every spec has a pre-raid and raid BIS list for each race, and every listed item has a real icon and a source.
for (const b of bis)
  for (const sp of b.specs)
    for (const [race, l] of Object.entries(sp.lists) as [string, { pre: [string, number][]; end: [string, number][] }][])
      assert(l.pre.length >= 12 && l.end.length >= 12, `${b.cls} ${sp.name} ${race}: BIS list too short`);
for (const [id, it] of Object.entries(bisItems) as [string, { i: string; src: string }][]) assert(icon.test(it.i) && it.src, `BIS item ${id} needs an icon and a source`);
console.log(`armory ok: ${sets.length} sets, ${weapons.length} weapons`);

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
// All 28 Forever specs have a level 60 list of at least 15 slots, each with a source, and every item has a real icon.
const FLAGS = ["", "New in Forever", "Changed", "Not in beta client"];
assert.equal(bis.reduce((n: number, b: { specs: unknown[] }) => n + b.specs.length, 0), 28);
for (const b of bis)
  for (const sp of b.specs) {
    assert(sp.list.length >= 15, `${b.cls} ${sp.name}: BIS list too short`);
    for (const [slot, id, src, flag] of sp.list) assert(bisItems[id] && src && FLAGS.includes(flag), `${b.cls} ${sp.name} ${slot}: bad row`);
  }
for (const [id, it] of Object.entries(bisItems) as [string, { i: string }][]) assert(icon.test(it.i), `BIS item ${id} needs an icon`);
console.log(`armory ok: ${sets.length} sets, ${weapons.length} weapons`);

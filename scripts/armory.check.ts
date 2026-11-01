// Run: node --experimental-strip-types scripts/armory.check.ts
// Every armory item must carry a real zamimg icon name, and only Classic-era items (Wowhead ids < 24000) are listed.
import assert from "node:assert";
import fs from "node:fs";
const { sets, weapons, bis, bisItems } = JSON.parse(fs.readFileSync("src/data/armory.json", "utf8"));
const icon = /^[a-z0-9_]+$/;
// Sets are WoW Forever's own (client ids, so Forever-new pieces have ids above 24000). Only the Hyjal sets, whose pieces
// aren't in the client yet, may have no pieces; every piece shown has a real icon.
for (const s of sets) {
  assert(s.id > 0 && s.bonuses.length > 0, `${s.name} needs a Wowhead set id and its bonuses`);
  assert(s.items.length > 0 || s.group.includes("Hyjal"), `${s.name} has no pieces`);
  for (const p of s.items) assert(icon.test(p.i) && p.id > 0, `${s.name}: ${p.n} needs a zamimg icon name`);
}
const names = new Set(sets.map((s: { name: string }) => s.name));
for (const n of ["Inquisition Warplate", "Inquisition Armor", "Inquisition Bulwark", "Inquisition Shockplate", "Battlegear of Glory", "Dreamwalker Raiment"])
  assert(names.has(n), `${n} is missing`);
assert(sets.length > 300, "expected every Forever set");
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

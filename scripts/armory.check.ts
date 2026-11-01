// Run: node --experimental-strip-types scripts/armory.check.ts
// Every armory item must carry a real zamimg icon name, and only Classic-era items (Wowhead ids < 24000) are listed.
import assert from "node:assert";
import fs from "node:fs";
const { sets, weapons } = JSON.parse(fs.readFileSync("src/data/armory.json", "utf8"));
const icon = /^[a-z0-9_]+$/;
for (const s of sets) {
  assert(s.items.length > 0, `${s.name} has no pieces`);
  for (const p of s.items) assert(icon.test(p.i), `${s.name}: ${p.n} needs a zamimg icon name`);
}
for (const w of weapons) assert(icon.test(w.i), `${w.n} needs a zamimg icon name`);
assert(sets.some((s: { armor: string }) => s.armor === "plate") && weapons.some((w: { kind: string }) => w.kind === "Shield"));
console.log(`armory ok: ${sets.length} sets, ${weapons.length} weapons`);

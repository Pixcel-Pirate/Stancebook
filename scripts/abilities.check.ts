// Run: node --experimental-strip-types scripts/abilities.check.ts
// Talent abilities must say so in the description, and every race's priest spells must exist.
import assert from "node:assert";
import { abilitiesFor, findAbility } from "../src/lib/abilities.ts";
import { RACES } from "../src/lib/races.ts";

for (const c of ["warrior", "paladin", "hunter", "rogue", "priest", "shaman", "mage", "warlock", "druid"] as const)
  for (const a of abilitiesFor(c))
    assert.equal(a.meta.includes("Talent"), a.desc.startsWith("Talent ("), `${c} ${a.name}: Talent meta and description disagree`);
for (const r of RACES) {
  assert.equal(r.priestSpells.length > 0, r.classes.includes("priest"), `${r.name} priest spells`);
  for (const n of r.priestSpells) assert.ok(findAbility("priest", n), `${r.name}: ${n} missing from priest list`);
}
console.log("abilities ok");

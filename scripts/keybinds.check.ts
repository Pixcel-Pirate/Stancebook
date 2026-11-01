// Run: node --experimental-strip-types scripts/keybinds.check.ts
// Every suggested keybind names a real ability, and no key or class spell is used twice.
import assert from "node:assert";
import { findAbility } from "../src/lib/abilities.ts";
import { GENERIC, KEYBINDS } from "../src/lib/keybinds.ts";

for (const [c, groups] of Object.entries(KEYBINDS)) {
  const keys = new Set<string>();
  const spells = new Set<string>();
  for (const g of groups)
    for (const [key, name] of g.binds) {
      const spell = findAbility(c as keyof typeof KEYBINDS, name);
      assert.ok(spell || GENERIC[name], `${c}: ${name} is not in the ability list`);
      if (spell) assert.ok(!spells.has(name), `${c}: ${name} bound twice`);
      spells.add(name);
      // druid form bars reuse keys on purpose
      const slot = g.title.includes("Form bar") ? `${g.title}:${key}` : key;
      assert.ok(!keys.has(slot), `${c}: ${key} used twice`);
      keys.add(slot);
    }
}
console.log("keybinds ok");

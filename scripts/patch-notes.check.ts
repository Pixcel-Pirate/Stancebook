// Run: node --experimental-strip-types scripts/patch-notes.check.ts
// Every class must have notes for every class patch, and every line must be a short sentence.
import assert from "node:assert";
import { PATCHES, PATCH_NOTES } from "../src/lib/patch-notes.ts";

const ids = new Set(PATCHES.map((p) => p.id));
for (const p of PATCHES) if (p.id !== "launch") assert.match(p.date ?? "", /^2026-\d\d-\d\d$/, `${p.id}: needs a date`);
for (const [cls, notes] of Object.entries(PATCH_NOTES)) {
  for (const id of Object.keys(notes)) assert.ok(ids.has(id), `${cls}: unknown patch ${id}`);
  assert.ok(notes.launch?.length, `${cls}: missing launch notes`);
  assert.ok(notes.sept24?.length && notes.oct15?.length, `${cls}: missing Sept 24 / Oct 15`);
  for (const line of Object.values(notes).flat()) assert.match(line!, /^[A-Z0-9].{8,220}[.!)]$/, `${cls}: ${line}`);
}
console.log("ok", Object.keys(PATCH_NOTES).length, "classes");

// Run: node --experimental-strip-types scripts/patch.check.ts
// The top patch strip must pick the newest "<Mon D> patch" tag and find notes for it.
import assert from "node:assert";
import { LATEST_PATCH, latestPatchNotes } from "../src/lib/guide.ts";

assert.match(LATEST_PATCH, /^\w+ \d+ patch$/);
assert.ok(latestPatchNotes("warrior").every((n) => n.tag === LATEST_PATCH));
assert.ok(["warrior", "mage", "druid"].some((c) => latestPatchNotes(c as "warrior").length > 0));
console.log("ok", LATEST_PATCH);

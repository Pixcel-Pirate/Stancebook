// Run: node --experimental-strip-types scripts/profession-picks.check.ts
// Every spec of every class has a best and alt profession pair, with a reason and a real icon.
// (macros.ts can't load under plain node, so coverage is counted: 9 classes x 3 specs.)
import assert from "node:assert";
import { PROF_META, PROF_PICKS } from "../src/lib/profession-picks.ts";

assert.equal(Object.keys(PROF_PICKS).length, 9, "every class has picks");
for (const [cls, specs] of Object.entries(PROF_PICKS)) {
  assert.equal(Object.keys(specs).length, 3, `${cls}: picks for all 3 specs`);
  for (const [spec, p] of Object.entries(specs)) {
    for (const pick of [p.best, p.alt]) {
      assert.ok(pick.why.length > 40, `${cls}/${spec}: reason too short`);
      assert.notEqual(pick.pair[0], pick.pair[1], `${cls}/${spec}: same profession twice`);
      for (const id of pick.pair) assert.ok(PROF_META[id]?.icon, `${cls}/${spec}: ${id} has no icon`);
    }
    assert.notDeepEqual(p.best.pair, p.alt.pair, `${cls}/${spec}: best and alt are the same`);
  }
}
console.log("profession picks ok");

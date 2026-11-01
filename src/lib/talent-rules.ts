import type { Talent, Tree } from "./talents";

export const MAX_POINTS = 51; // levels 10-60, one point per level
export const pointsAt = (level: number) => Math.max(0, Math.min(level, 60) - 9);

/** Points spent: tree index -> talent name -> rank. */
export type Spent = Record<number, Record<string, number>>;

export const rankOf = (s: Spent, tree: number, n: string) => s[tree]?.[n] ?? 0;
export const treeTotal = (s: Spent, tree: number) => Object.values(s[tree] ?? {}).reduce((a, b) => a + b, 0);
export const grandTotal = (s: Spent) => Object.keys(s).reduce((a, k) => a + treeTotal(s, +k), 0);

/** Points spent in a tree below the given tier. */
function below(trees: Tree[], s: Spent, tree: number, tier: number) {
  return trees[tree].talents.reduce((a, t) => a + (t.t < tier ? rankOf(s, tree, t.n) : 0), 0);
}

const prereq = (trees: Tree[], tree: number, t: Talent) => (t.p ? trees[tree].talents.find((u) => u.n === t.p) : undefined);

/** Why a point can't go in yet (row lock or missing prerequisite), or null if only rank/points limits apply. */
export function lockReason(trees: Tree[], s: Spent, tree: number, t: Talent) {
  const need = (t.t - 1) * 5;
  if (below(trees, s, tree, t.t) < need) return `Requires ${need} points in ${trees[tree].tree}`;
  const p = prereq(trees, tree, t);
  if (p && rankOf(s, tree, p.n) < p.r) return `Requires ${p.r} point${p.r > 1 ? "s" : ""} in ${p.n}`;
  return null;
}

export function canAdd(trees: Tree[], s: Spent, tree: number, t: Talent, max = MAX_POINTS) {
  return rankOf(s, tree, t.n) < t.r && grandTotal(s) < max && !lockReason(trees, s, tree, t);
}

/** A point can come out only if every talent above still has enough points under it and nothing that needs it maxed has points. */
export function canRemove(trees: Tree[], s: Spent, tree: number, t: Talent) {
  if (!rankOf(s, tree, t.n)) return false;
  const next = change(s, tree, t, -1);
  return trees[tree].talents.every((u) => !rankOf(next, tree, u.n) || !lockReason(trees, next, tree, u));
}

export function change(s: Spent, tree: number, t: Talent, d: number): Spent {
  return { ...s, [tree]: { ...s[tree], [t.n]: rankOf(s, tree, t.n) + d } };
}

/** Shift-click: add (or remove) as many points as the rules allow. */
export function fill(trees: Tree[], s: Spent, tree: number, t: Talent, remove: boolean, max = MAX_POINTS): Spent {
  while (remove ? canRemove(trees, s, tree, t) : canAdd(trees, s, tree, t, max)) s = change(s, tree, t, remove ? -1 : 1);
  return s;
}

/** Build code: one digit per talent in tree order, trailing zeros trimmed, trees joined by "-" (e.g. "0532-05-"). */
export function encode(trees: Tree[], s: Spent) {
  return trees.map((tr, i) => tr.talents.map((t) => rankOf(s, i, t.n)).join("").replace(/0+$/, "")).join("-");
}

/** Replays a build code through the rules so a hand-edited or stale link can't produce an illegal build. */
export function decode(trees: Tree[], code: string, max = MAX_POINTS): Spent {
  const parts = code.split("-");
  let s: Spent = {};
  // rows bottom-up, so every point lands after the points that unlock it
  for (let row = 1; row <= 7; row++)
    trees.forEach((tr, i) =>
      tr.talents.forEach((t, k) => {
        if (t.t !== row) return;
        const want = Math.min(Number(parts[i]?.[k]) || 0, t.r);
        for (let r = 0; r < want && canAdd(trees, s, i, t, max); r++) s = change(s, i, t, 1);
      }),
    );
  return s;
}

/** A talent's text at one rank: "{1|5}%" reads 3% at rank 3 of 5. Middle ranks are interpolated
 *  (the site lists only the first and last), rounded like the game does. */
export function rankText(t: Talent, rank: number): string {
  const k = Math.min(Math.max(rank, 1), t.r);
  return t.e.replace(/\{([\d.]+)\|([\d.]+)\}/g, (_, a: string, b: string) => {
    const lo = Number(a), hi = Number(b);
    const v = t.r < 2 ? hi : lo + ((hi - lo) * (k - 1)) / (t.r - 1);
    const dec = a.includes(".") || b.includes(".");
    return String(dec ? Math.round(v * 100) / 100 : Math.round(v));
  });
}

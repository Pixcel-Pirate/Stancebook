import type { Talent, Tree } from "./talents";

export const MAX_POINTS = 51; // levels 10-60, one point per level

/** Points spent: tree index -> talent name -> rank. */
export type Spent = Record<number, Record<string, number>>;

export const treeTotal = (s: Spent, tree: number) => Object.values(s[tree] ?? {}).reduce((a, b) => a + b, 0);
export const grandTotal = (s: Spent) => Object.keys(s).reduce((a, k) => a + treeTotal(s, +k), 0);

/** Points spent in a tree below the given tier. */
function below(trees: Tree[], s: Spent, tree: number, tier: number) {
  return trees[tree].talents.reduce((a, t) => a + (t.t < tier ? s[tree]?.[t.n] ?? 0 : 0), 0);
}

export function canAdd(trees: Tree[], s: Spent, tree: number, t: Talent) {
  return (s[tree]?.[t.n] ?? 0) < t.r && grandTotal(s) < MAX_POINTS && below(trees, s, tree, t.t) >= (t.t - 1) * 5;
}

/** A point can come out only if every talent above still has enough points under it. */
export function canRemove(trees: Tree[], s: Spent, tree: number, t: Talent) {
  if (!(s[tree]?.[t.n] ?? 0)) return false;
  const next = { ...s, [tree]: { ...s[tree], [t.n]: s[tree][t.n] - 1 } };
  return trees[tree].talents.every((u) => !(next[tree][u.n] ?? 0) || below(trees, next, tree, u.t) >= (u.t - 1) * 5);
}

export function change(s: Spent, tree: number, t: Talent, d: 1 | -1): Spent {
  return { ...s, [tree]: { ...s[tree], [t.n]: (s[tree]?.[t.n] ?? 0) + d } };
}

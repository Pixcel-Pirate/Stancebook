import type { ClassId } from "@/lib/macros";

/** One talent, paraphrased from wowforevertalents.com. t = tier (row), r = max ranks, f = new or changed in Forever. */
export type Talent = { n: string; t: number; r: number; i: string | null; e: string; f: boolean };
export type Tree = { tree: string; talents: Talent[] };

const files = import.meta.glob<Tree[]>("../data/talents/*.json", { eager: true, import: "default" });

export function treesFor(id: ClassId): Tree[] {
  return files[`../data/talents/${id}.json`] ?? [];
}

export const TALENTS_SOURCE = "https://wowforevertalents.com";

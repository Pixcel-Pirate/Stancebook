import { ALCHEMY } from "../data/professions/alchemy.ts";
import { ENCHANTING } from "../data/professions/enchanting.ts";
import { ENGINEERING } from "../data/professions/engineering.ts";
import { LEATHERWORKING } from "../data/professions/leatherworking.ts";
import { TAILORING } from "../data/professions/tailoring.ts";
import { BLACKSMITHING } from "../data/professions/blacksmithing.ts";

export type ProfessionId =
  | "alchemy"
  | "blacksmithing"
  | "enchanting"
  | "engineering"
  | "leatherworking"
  | "tailoring"
  | "herbalism"
  | "mining"
  | "skinning"
  | "cooking"
  | "first-aid"
  | "fishing";

/** qty is per craft. icon is a zamimg icon name (wow.zamimg.com/images/wow/icons/large/<icon>.jpg). */
export type Mat = { name: string; icon: string; qty: number; id?: number };

export type Step = {
  from: number;
  to: number;
  /** Recipe name, or zone/node for gathering steps. */
  title: string;
  icon: string;
  /** Wowhead item id of what the step makes, for a link. */
  id?: number;
  count?: number;
  /** Items one craft makes, when more than 1 (Fire Oil, Stonescale Oil). */
  makes?: number;
  mats?: Mat[];
  where?: string;
  note?: string;
};

export type Trainer = { rank: string; skill: number; level?: number; where?: string };

export type ProfessionGuide = {
  id: ProfessionId;
  name: string;
  icon: string;
  kind: "crafting" | "gathering" | "secondary";
  summary: string;
  trainers: Trainer[];
  steps: Step[];
  tips?: string[];
};

/** Add a guide: one file in src/data/professions/, one line here. */
export const PROFESSIONS: ProfessionGuide[] = [ALCHEMY, BLACKSMITHING, ENCHANTING, ENGINEERING, LEATHERWORKING, TAILORING];

export type Total = Mat & { made?: number };

/**
 * Raw shopping list for the whole route, from each step's count x per-craft mats.
 * A mat that another step makes (grinding stones etc.) is netted against what the route already crafts; any shortfall
 * is expanded into that step's own mats, so the list only holds what you gather or buy.
 */
export function materialTotals(g: ProfessionGuide): Total[] {
  const made = new Map<string, Step>();
  for (const s of g.steps) if (s.mats?.length && !made.has(s.title)) made.set(s.title, s);
  const need = new Map<string, Mat>();
  const add = (m: Mat, qty: number) => {
    const cur = need.get(m.name);
    if (cur) cur.qty += qty;
    else need.set(m.name, { ...m, qty });
  };
  for (const s of g.steps) for (const m of s.mats ?? []) add(m, m.qty * (s.count ?? 0));
  const out: Total[] = [];
  // Intermediates first, so expanding one can add to raw mats before those are listed.
  for (const [name, recipe] of made) {
    const m = need.get(name);
    if (!m) continue;
    const crafted = g.steps.filter((s) => s.title === name).reduce((n, s) => n + (s.count ?? 0) * (s.makes ?? 1), 0);
    const short = Math.ceil((m.qty - crafted) / (recipe.makes ?? 1));
    if (short > 0) for (const r of recipe.mats ?? []) add(r, r.qty * short);
    need.delete(name);
  }
  for (const m of need.values()) out.push(m);
  return out.sort((a, b) => b.qty - a.qty);
}

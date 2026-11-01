import type { ClassId } from "@/lib/macros";

/** One talent, paraphrased from wowforevertalents.com. t = row (tier), c = column 1-4, r = max ranks,
 *  s = "n" new in Forever / "c" changed from Classic (absent = same as Classic), p = talent it needs maxed first. */
export type Talent = { n: string; t: number; c: number; r: number; i: string | null; e: string; s?: "n" | "c"; p?: string };
export type Tree = { tree: string; talents: Talent[] };

const files = import.meta.glob<Tree[]>("../data/talents/*.json", { eager: true, import: "default" });

export function treesFor(id: ClassId): Tree[] {
  return files[`../data/talents/${id}.json`] ?? [];
}

/** Spec emblem icon and two backdrop colors per tree, in tree order. */
export const SPEC_ART: Record<ClassId, [icon: string, a: string, b: string][]> = {
  warrior: [["ability_warrior_savageblow", "#c2602a", "#3a1a0c"], ["ability_warrior_innerrage", "#d8361c", "#2e0b06"], ["ability_warrior_defensivestance", "#3f7f9a", "#0f2430"]],
  paladin: [["spell_holy_holybolt", "#e9b44c", "#3a2608"], ["spell_holy_devotionaura", "#4f86b8", "#0e1d30"], ["spell_holy_auraoflight", "#e07a2c", "#3a1606"]],
  hunter: [["ability_hunter_beasttaming", "#3a5fb0", "#0b1430"], ["ability_marksmanship", "#b0904e", "#2b2010"], ["ability_hunter_swiftstrike", "#3aa07a", "#0c2a20"]],
  rogue: [["ability_rogue_eviscerate", "#3f8f94", "#0b2326"], ["ability_backstab", "#9a6a3c", "#26180c"], ["ability_stealth", "#4f7f7a", "#0d1f1d"]],
  priest: [["spell_holy_wordfortitude", "#c9a46a", "#2e2210"], ["spell_holy_guardianspirit", "#d9c25c", "#2c2608"], ["spell_shadow_shadowwordpain", "#3f8a8a", "#0a1e22"]],
  shaman: [["spell_nature_lightning", "#8a4fd0", "#1a0c30"], ["spell_nature_lightningshield", "#5a6ad8", "#2a1608"], ["spell_nature_magicimmunity", "#5fa040", "#122a0c"]],
  mage: [["spell_holy_magicalsentry", "#3f7fd0", "#0c1a34"], ["spell_fire_firebolt02", "#e0602a", "#300e04"], ["spell_frost_frostbolt02", "#6fb0e0", "#0e2034"]],
  warlock: [["spell_shadow_deathcoil", "#3fa080", "#08201a"], ["spell_shadow_metamorphosis", "#6fc03a", "#122a08"], ["spell_shadow_rainoffire", "#e0502a", "#300c04"]],
  druid: [["spell_nature_starfall", "#3f9a8a", "#0a2420"], ["ability_racial_bearform", "#7a5ab0", "#1a1230"], ["spell_nature_healingtouch", "#8ab060", "#1e2a10"]],
};

export const TALENTS_SOURCE = "https://wowforevertalents.com";

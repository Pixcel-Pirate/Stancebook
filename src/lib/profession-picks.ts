import type { ClassId, Spec } from "./macros";

// Ids match the Progression tab guides (section DOM id prof-<id>).
export type ProfId =
  | "alchemy" | "blacksmithing" | "enchanting" | "engineering" | "leatherworking" | "tailoring"
  | "herbalism" | "mining" | "skinning";

export type ProfPick = { pair: [ProfId, ProfId]; why: string };
export type SpecPicks = { best: ProfPick; alt: ProfPick };

const ENG: ProfPick = {
  pair: ["engineering", "mining"],
  why: "Grenades, Goblin Sapper Charges and Iron Grenade stuns are free extra damage and control, and Mining feeds every recipe. The strongest pair for PvP and melee raid DPS.",
};
const ALCH: ProfPick = {
  pair: ["alchemy", "herbalism"],
  why: "You brew your own flasks and mana potions at cost, transmutes sell, and Herbalism pays for the whole climb. Best for healers who burn through consumables.",
};
const CLOTH: ProfPick = {
  pair: ["tailoring", "enchanting"],
  why: "You sew your own cloth gear from the cloth you loot anyway, then disenchant the greens for enchanting mats. Wands and many of the best caster robes are tailoring crafts.",
};
const LEATHER: ProfPick = {
  pair: ["leatherworking", "skinning"],
  why: "You skin everything you kill, make your own leather or mail and armor kits, and Devilsaur and other BoE leather sells well.",
};
const SMITH: ProfPick = {
  pair: ["blacksmithing", "mining"],
  why: "You forge your own weapons and plate, sharpening stones and weightstones, and Mining supplies the bars. Arcanite Reaper and other big two-handers are blacksmith crafts.",
};

export const PROF_PICKS: Record<ClassId, Partial<Record<Spec, SpecPicks>>> = {
  warrior: {
    arms: { best: ENG, alt: SMITH },
    fury: { best: ENG, alt: SMITH },
    protection: { best: ENG, alt: { ...SMITH, why: "Forge your own plate, shield spikes and weightstones. Engineering is still better for raid utility." } },
  },
  paladin: {
    holy: { best: ALCH, alt: { ...CLOTH, why: "Enchant your own Healing Power and Intellect upgrades and disenchant dungeon greens. A good second choice if you don't want to farm herbs." } },
    protection: { best: ENG, alt: SMITH },
    retribution: { best: SMITH, alt: ENG },
  },
  hunter: {
    "beast-mastery": { best: { ...LEATHER, why: "You make your own mail and leather, armor kits and ammo pouches and quivers, and skin every beast you and your pet kill. Easy gold while leveling." }, alt: ENG },
    marksmanship: { best: { ...ENG, why: "Scopes, your own guns and ammo, Goblin Sapper Charges and target dummies. Mining feeds it. The best hunter pair for raids and PvP." }, alt: LEATHER },
    survival: { best: ENG, alt: LEATHER },
  },
  rogue: {
    assassination: { best: LEATHER, alt: ENG },
    combat: { best: ENG, alt: LEATHER },
    subtlety: { best: { ...ENG, why: "Iron Grenade stuns, Net-o-Matic, target dummies and Sapper Charges are the extra control that wins rogue fights. Mining feeds it." }, alt: LEATHER },
  },
  priest: {
    discipline: { best: ALCH, alt: CLOTH },
    holy: { best: ALCH, alt: CLOTH },
    shadow: { best: { ...CLOTH, why: "Sew your own spell power cloth (Truefaith Vestments is a priest tailoring craft), wands, and disenchant dungeon greens to enchant your gear." }, alt: { pair: ["engineering", "tailoring"], why: "For PvP: grenades and bombs give a shadow priest stuns on top of Fear and Silence, and Tailoring keeps your cloth gear up." } },
  },
  shaman: {
    elemental: { best: ENG, alt: ALCH },
    enhancement: { best: { ...LEATHER, why: "You craft your own mail and leather agility gear, skin everything you kill, and armor kits keep it upgraded." }, alt: ENG },
    restoration: { best: ALCH, alt: { ...LEATHER, why: "Make your own mail healing gear and skin as you level. Alchemy is still better for raid consumables." } },
  },
  mage: {
    arcane: { best: CLOTH, alt: ALCH },
    fire: { best: CLOTH, alt: { pair: ["engineering", "tailoring"], why: "Fire burst plus grenades and Sapper Charges in PvP, while Tailoring keeps your spell power gear current." } },
    frost: { best: { pair: ["engineering", "tailoring"], why: "Frost is the PvP spec: grenades, Net-o-Matic and target dummies on top of Frost Nova and Blink, while Tailoring makes your cloth gear." }, alt: CLOTH },
  },
  warlock: {
    affliction: { best: CLOTH, alt: ALCH },
    demonology: { best: CLOTH, alt: ALCH },
    destruction: { best: CLOTH, alt: { pair: ["engineering", "tailoring"], why: "For PvP: grenades add stuns to Fear and Death Coil, and Tailoring (Felcloth crafts) keeps your gear current." } },
  },
  druid: {
    balance: { best: CLOTH, alt: ALCH },
    feral: { best: { ...LEATHER, why: "Feral wears leather, so you craft your own agility and tank gear, skin everything in Cat Form, and sell the leather you don't need." }, alt: ENG },
    restoration: { best: ALCH, alt: { ...LEATHER, why: "Herb-free option: make your own leather healing gear and skin while you level. Alchemy is better for raids." } },
  },
};

export const LEVELING_TIP =
  "While leveling, many players take two gathering professions (Herbalism, Mining or Skinning) to pay for training and a mount, then swap one for a crafting profession near 60. Take First Aid, Cooking and Fishing on every character: they don't use a profession slot.";

// ponytail: own label/icon map; swap to the Progression registry if it exports icons.
export const PROF_META: Record<ProfId, { label: string; icon: string; gather?: true }> = {
  alchemy: { label: "Alchemy", icon: "trade_alchemy" },
  blacksmithing: { label: "Blacksmithing", icon: "trade_blacksmithing" },
  enchanting: { label: "Enchanting", icon: "trade_engraving" },
  engineering: { label: "Engineering", icon: "trade_engineering" },
  leatherworking: { label: "Leatherworking", icon: "inv_misc_armorkit_17" },
  tailoring: { label: "Tailoring", icon: "trade_tailoring" },
  herbalism: { label: "Herbalism", icon: "spell_nature_naturetouchgrow", gather: true },
  mining: { label: "Mining", icon: "trade_mining", gather: true },
  skinning: { label: "Skinning", icon: "inv_misc_pelt_wolf_01", gather: true },
};

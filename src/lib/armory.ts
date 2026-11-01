import data from "@/data/armory.json";
import type { ClassId } from "./macros";
import type { Race } from "./races";

/** WoW Forever's gear sets from its own client data, plus Classic epic weapons (scripts/armory.gen.ts). */
export type Armor = "cloth" | "leather" | "mail" | "plate";
export type Piece = { id: number; n: string; i: string; s: string; q: number; src: string };
export type GearSet = {
  id: number;
  name: string;
  group: string;
  cls: ClassId[];
  armor: Armor | null;
  faction: Race["faction"] | null;
  items: Piece[];
  /** Pieces of the set that aren't in the game files yet. */
  missing: number;
  bonuses: string[];
};
export type Weapon = { id: number; n: string; i: string; q: number; src: string; kind: string; hand: string };

export const SETS = data.sets as GearSet[];
export const WEAPONS = data.weapons as Weapon[];

export const QUALITY = ["Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary"];
export const QUALITY_COLOR = ["#9d9d9d", "#fff", "#1eff00", "#0070dd", "#a335ee", "#ff8000"];

/** Who can wear each armor type, at any level, in Classic. */
export const ARMOR_CLASSES: Record<Armor, ClassId[]> = {
  cloth: ["warrior", "paladin", "hunter", "rogue", "priest", "shaman", "mage", "warlock", "druid"],
  leather: ["warrior", "paladin", "hunter", "rogue", "shaman", "druid"],
  mail: ["warrior", "paladin", "hunter", "shaman"],
  plate: ["warrior", "paladin"],
};

/** Classic weapon skills each class can learn. Two-hand variants are keyed "2H <kind>". */
const WEAPON_CLASSES: Record<string, ClassId[]> = {
  Sword: ["warrior", "paladin", "hunter", "rogue", "mage", "warlock"],
  "2H Sword": ["warrior", "paladin", "hunter"],
  Axe: ["warrior", "paladin", "hunter", "shaman"],
  "2H Axe": ["warrior", "paladin", "hunter", "shaman"],
  Mace: ["warrior", "paladin", "rogue", "priest", "shaman", "druid"],
  "2H Mace": ["warrior", "paladin", "shaman", "druid"],
  Dagger: ["warrior", "hunter", "rogue", "priest", "shaman", "mage", "warlock", "druid"],
  "Fist Weapon": ["warrior", "hunter", "rogue", "shaman", "druid"],
  Polearm: ["warrior", "paladin", "hunter"],
  Staff: ["warrior", "hunter", "priest", "shaman", "mage", "warlock", "druid"],
  Shield: ["warrior", "paladin", "shaman"],
  "Held in Off-hand": ARMOR_CLASSES.cloth,
  Bow: ["warrior", "hunter", "rogue"],
  Crossbow: ["warrior", "hunter", "rogue"],
  Gun: ["warrior", "hunter", "rogue"],
  Thrown: ["warrior", "hunter", "rogue"],
  Wand: ["priest", "mage", "warlock"],
  Idol: ["druid"],
  Libram: ["paladin"],
  Totem: ["shaman"],
};

export function weaponClasses(w: Weapon): ClassId[] {
  return WEAPON_CLASSES[w.hand === "Two-Hand" && WEAPON_CLASSES["2H " + w.kind] ? "2H " + w.kind : w.kind] ?? [];
}

/** Classes that can use a set: its class lock, else everyone who can wear its armor. */
export function setClasses(s: GearSet): ClassId[] {
  return s.cls.length ? s.cls : ARMOR_CLASSES[s.armor ?? "cloth"];
}

/** WoW Forever level 60 best-in-slot lists per class and spec, from The Forever Era (see scripts/armory.gen.ts). */
export type BisFlag = "" | "New in Forever" | "Changed" | "Not in beta client";
export type BisRow = [slot: string, itemId: number, source: string, flag: BisFlag];
export type BisItem = { n: string; i: string; q: number };
export const BIS = data.bis as unknown as { cls: ClassId; specs: { name: string; list: BisRow[] }[] }[];
export const BIS_ITEMS = data.bisItems as unknown as Record<string, BisItem>;

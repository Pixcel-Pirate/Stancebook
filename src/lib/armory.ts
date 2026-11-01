import data from "@/data/armory.json";
import type { ClassId } from "./macros";
import type { Race } from "./races";

/** Classic gear from Wowhead's Classic database (scripts/armory.gen.ts) plus WoW Forever's new sets. */
export type Armor = "cloth" | "leather" | "mail" | "plate";
export type Piece = { n: string; i: string; s: string; q: number; src: string };
export type GearSet = {
  id: number;
  name: string;
  group: string;
  cls: ClassId[];
  armor: Armor | null;
  faction: Race["faction"] | null;
  items: Piece[];
  bonuses?: string[];
};
export type Weapon = { n: string; i: string; q: number; src: string; kind: string; hand: string };

export const SETS = data.sets as GearSet[];
export const WEAPONS = data.weapons as Weapon[];

export const QUALITY = ["Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary"];

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

const ARMOR_OF: Record<ClassId, Armor> = {
  warrior: "plate", paladin: "plate", hunter: "mail", shaman: "mail", rogue: "leather", druid: "leather", priest: "cloth", mage: "cloth", warlock: "cloth",
};
const forever = (id: number, cls: ClassId, name: string, bonuses: string[]): GearSet => ({
  id, name, group: "WoW Forever · Season 1 (Hyjal)", cls: [cls], armor: ARMOR_OF[cls], faction: null, items: [], bonuses,
});

/** Forever's Hyjal raid sets. Their pieces aren't in the client yet, so only the datamined bonuses are known. */
export const FOREVER_SETS: GearSet[] = [
  forever(-1, "druid", "Grovekeeper Raiment", ["2: +10 Spirit", "3: Barkskin cooldown -10 sec", "4: +26 healing and +9 spell damage", "5: Swiftmend cooldown -3 sec"]),
  forever(-2, "druid", "Grovekeeper Rage", ["2: +7 Defense", "3: Rebirth usable in bear forms, 2 sec faster cast", "4: 1.2% less chance to be dodged or parried", "5: Berserk cooldown -15 sec"]),
  forever(-3, "druid", "Grovekeeper Eclipse", ["2: +1% hit", "3: Nature's Grasp cooldown -15 sec", "4: +21 spell damage against Demons", "5: Insect Swarm lasts 3 sec longer"]),
  forever(-4, "druid", "Grovekeeper Ferocity", ["2: +1% attack and casting speed", "3: Hibernate usable in Cat Form, 1.5 sec faster, 15 sec cooldown", "4: +36 attack power against Demons", "5: Tiger's Fury cooldown -3 sec"]),
  forever(-5, "hunter", "Wildstalker Armor", ["2: +1% attack and casting speed", "3: Frost and Freezing Trap cooldown -3 sec", "4: +36 attack power against Beasts", "5: Aimed Shot and Multi-Shot cooldown -1 sec"]),
  forever(-6, "mage", "Manaflare Regalia", ["2: +1% hit", "3: Counterspell cooldown -5 sec", "4: +21 spell damage against Elementals", "5: Frostfire Bolt: +10% Missile Barrage chance, +10% crit during Combustion, +10% Fingers of Frost chance"]),
  forever(-7, "paladin", "Justice Armor", ["2: +10 Spirit", "3: Blessing of Protection cooldown -30 sec", "4: +26 healing and +9 spell damage", "5: Holy Shock cooldown -1 sec"]),
  forever(-8, "paladin", "Justice Battlegear", ["2: +1% attack and casting speed", "3: Hammer of Justice cooldown -5 sec", "4: +36 attack power against Undead", "5: Judgement cooldown -0.5 sec"]),
  forever(-9, "paladin", "Justice Battleplate", ["2: +7 Defense", "3: Turn Undead cast 1.5 sec faster", "4: 1.2% less chance to be dodged or parried", "5: Forbearance lasts 10 sec less"]),
  forever(-10, "priest", "Vestments of Conviction", ["2: +10 Spirit", "3: Fear Ward cooldown -60 sec", "4: +26 healing and +9 spell damage", "5: Penance and Prayer of Mending cooldown -1 sec"]),
  forever(-11, "priest", "Raiments of Conviction", ["2: +1% hit", "3: Shackle Undead lasts 10 sec longer", "4: +21 spell damage against Undead", "5: Devouring Plague cooldown -60 sec"]),
  forever(-12, "rogue", "Grimstitch Armor", ["2: +1% hit", "3: Kidney Shot cooldown -3 sec", "4: +36 attack power against Humanoids", "5: Envenom and Eviscerate cost 5 less Energy"]),
  forever(-13, "shaman", "The Spiritcaller", ["2: +10 Spirit", "3: Fire and Water totems reach 10 yards farther", "4: +26 healing and +9 spell damage", "5: Riptide cooldown -1 sec"]),
  forever(-14, "shaman", "The Spiritcaller's Rage", ["2: +1% attack and casting speed", "3: Air and Earth totems reach 10 yards farther", "4: +36 attack power against Elementals", "5: Stormstrike cooldown -0.5 sec"]),
  forever(-15, "shaman", "The Spiritcaller's Storm", ["2: +1% hit", "3: Earthbind Totem cooldown -2 sec", "4: +21 spell damage against Elementals", "5: Lava Burst cooldown -1 sec"]),
  forever(-16, "warlock", "Demonheart Raiment", ["2: +1% hit", "3: Banish cast 1.5 sec faster", "4: +21 spell damage against Demons", "5: Life Tap gives 20% more mana at no extra health cost"]),
  forever(-17, "warrior", "Battlegear of Glory", ["2: +1% attack and casting speed", "3: Intimidating Shout cooldown -30 sec", "4: +36 attack power against Humanoids", "5: Recklessness cooldown -30 sec"]),
  forever(-18, "warrior", "Battleplate of Glory", ["2: +7 Defense", "3: Intervene cooldown -10 sec", "4: 1.2% less chance to be dodged or parried", "5: Shield Wall cooldown -30 sec"]),
];

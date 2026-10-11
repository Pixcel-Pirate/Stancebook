import { DRUID_MACROS } from "./macros-druid";
import { HUNTER_MACROS } from "./macros-hunter";
import { MAGE_MACROS } from "./macros-mage";
import { PALADIN_MACROS } from "./macros-paladin";
import { PRIEST_MACROS } from "./macros-priest";
import { ROGUE_MACROS } from "./macros-rogue";
import { SHAMAN_MACROS } from "./macros-shaman";
import { WARLOCK_MACROS } from "./macros-warlock";
import { WARRIOR_MACROS } from "./macros-warrior";

export type ClassId =
  | "warrior"
  | "paladin"
  | "hunter"
  | "rogue"
  | "priest"
  | "shaman"
  | "mage"
  | "warlock"
  | "druid";

export type Spec =
  | "arms"
  | "fury"
  | "protection"
  | "holy"
  | "retribution"
  | "beast-mastery"
  | "marksmanship"
  | "survival"
  | "assassination"
  | "combat"
  | "subtlety"
  | "discipline"
  | "shadow"
  | "elemental"
  | "enhancement"
  | "restoration"
  | "arcane"
  | "fire"
  | "frost"
  | "affliction"
  | "demonology"
  | "destruction"
  | "balance"
  | "feral";

export type Category =
  | "essential"
  | "combat"
  | "stance"
  | "tank"
  | "pvp"
  | "utility"
  | "leveling"
  | "pet"
  | "stealth"
  | "heal"
  | "form";

export type MacroLine = {
  code: string;
  why: string;
};

export type Macro = {
  id: string;
  classId: ClassId;
  name: string;
  summary: string;
  how: string;
  when: string;
  category: Category;
  specs: Spec[];
  level: number;
  bind?: string;
  forever?: boolean;
  talent?: boolean;
  caveats?: string[];
  lines: MacroLine[];
};

export type MacroDraft = Omit<Macro, "classId">;

export const CLASS_IDS: ClassId[] = [
  "warrior",
  "paladin",
  "hunter",
  "rogue",
  "priest",
  "shaman",
  "mage",
  "warlock",
  "druid",
];

export const SPEC_LABEL: Record<Spec, string> = {
  arms: "Arms",
  fury: "Fury",
  protection: "Protection",
  holy: "Holy",
  retribution: "Retribution",
  "beast-mastery": "Beast Mastery",
  marksmanship: "Marksmanship",
  survival: "Survival",
  assassination: "Assassination",
  combat: "Combat",
  subtlety: "Subtlety",
  discipline: "Discipline",
  shadow: "Shadow",
  elemental: "Elemental",
  enhancement: "Enhancement",
  restoration: "Restoration",
  arcane: "Arcane",
  fire: "Fire",
  frost: "Frost",
  affliction: "Affliction",
  demonology: "Demonology",
  destruction: "Destruction",
  balance: "Balance",
  feral: "Feral",
};

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "essential", label: "Starter" },
  { id: "heal", label: "Heal" },
  { id: "pet", label: "Pet" },
  { id: "stealth", label: "Stealth" },
  { id: "form", label: "Form" },
  { id: "leveling", label: "Leveling" },
  { id: "combat", label: "Combat" },
  { id: "tank", label: "Tank" },
  { id: "pvp", label: "PvP" },
  { id: "stance", label: "Stance" },
  { id: "utility", label: "Utility" },
];

export function categoryLabel(id: Category | "all" | string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export const CLASS_META: {
  id: ClassId;
  label: string;
  hint: string;
  specs: { id: Spec | "all"; label: string; hint: string }[];
  categories: (Category | "all")[];
  starters: string[];
}[] = [
  {
    id: "warrior",
    label: "Warrior",
    hint: "Stances, rage, melee",
    specs: [
      { id: "all", label: "All specs", hint: "Every warrior" },
      { id: "arms", label: "Arms", hint: "Two-hander, Mortal Strike" },
      { id: "fury", label: "Fury", hint: "Dual wield, Bloodthirst" },
      { id: "protection", label: "Protection", hint: "Shield, threat" },
    ],
    categories: ["all", "essential", "leveling", "combat", "tank", "pvp", "stance", "utility"],
    starters: [
      "heroic-strike",
      "charge",
      "victory-rush",
      "battle-shout",
      "taunt-mouseover",
      "pummel",
      "charge-intercept",
      "shield-wall",
    ],
  },
  {
    id: "paladin",
    label: "Paladin",
    hint: "Seals, Judgement, heals",
    specs: [
      { id: "all", label: "All specs", hint: "Every paladin" },
      { id: "holy", label: "Holy", hint: "Heals, Holy Shock" },
      { id: "protection", label: "Protection", hint: "Seal of Fury, tank" },
      { id: "retribution", label: "Retribution", hint: "Holy Strike, seals" },
    ],
    categories: ["all", "essential", "heal", "leveling", "combat", "tank", "pvp", "utility"],
    starters: [
      "paladin-holy-strike",
      "paladin-judgement",
      "paladin-hammer-justice",
      "paladin-cleanse",
      "paladin-flash",
      "paladin-consecration",
      "paladin-divine-shield",
      "paladin-seal-fury",
    ],
  },
  {
    id: "hunter",
    label: "Hunter",
    hint: "Pet, Auto Shot, traps",
    specs: [
      { id: "all", label: "All specs", hint: "Every hunter" },
      { id: "beast-mastery", label: "Beast Mastery", hint: "Pet, Intimidation" },
      { id: "marksmanship", label: "Marksmanship", hint: "Aimed Shot, stings" },
      { id: "survival", label: "Survival", hint: "Traps, melee weave" },
    ],
    categories: ["all", "essential", "pet", "leveling", "combat", "pvp", "utility"],
    starters: [
      "hunter-auto-shot-pet",
      "hunter-mouseover-pet",
      "hunter-pet-care",
      "hunter-recall",
      "hunter-mark-pet",
      "hunter-serpent-pet",
      "hunter-aspects",
      "hunter-feign",
    ],
  },
  {
    id: "rogue",
    label: "Rogue",
    hint: "Stealth, combo points",
    specs: [
      { id: "all", label: "All specs", hint: "Every rogue" },
      { id: "assassination", label: "Assassination", hint: "Mutilate, poisons" },
      { id: "combat", label: "Combat", hint: "Sinister Strike, Adrenaline" },
      { id: "subtlety", label: "Subtlety", hint: "Ambush, Cheap Shot" },
    ],
    categories: ["all", "essential", "stealth", "leveling", "combat", "pvp", "utility"],
    starters: [
      "rogue-stealth-vanish",
      "rogue-sinister",
      "rogue-eviscerate",
      "rogue-sap-mouseover",
      "rogue-kick-mouseover",
      "rogue-ambush-backstab",
      "rogue-cheap-shot",
      "rogue-slice",
    ],
  },
  {
    id: "priest",
    label: "Priest",
    hint: "Shields, heals, Shadow",
    specs: [
      { id: "all", label: "All specs", hint: "Every priest" },
      { id: "discipline", label: "Discipline", hint: "Shields, Penance" },
      { id: "holy", label: "Holy", hint: "Heals, Prayer of Mending" },
      { id: "shadow", label: "Shadow", hint: "Shadowform, DoTs" },
    ],
    categories: ["all", "essential", "heal", "leveling", "combat", "pvp", "utility"],
    starters: [
      "priest-flash",
      "priest-shield",
      "priest-renew",
      "priest-fade",
      "priest-swpain",
      "priest-fear-ward",
      "priest-dispel",
      "priest-inner-fire",
    ],
  },
  {
    id: "shaman",
    label: "Shaman",
    hint: "Shocks, totems, heals",
    specs: [
      { id: "all", label: "All specs", hint: "Every shaman" },
      { id: "elemental", label: "Elemental", hint: "Lava Burst, Lightning" },
      { id: "enhancement", label: "Enhancement", hint: "Stormstrike, Maelstrom" },
      { id: "restoration", label: "Restoration", hint: "Riptide, Chain Heal" },
    ],
    categories: ["all", "essential", "heal", "leveling", "combat", "pvp", "utility"],
    starters: [
      "shaman-lightning",
      "shaman-earth-shock",
      "shaman-flame-shock",
      "shaman-healing-wave",
      "shaman-ghost-wolf",
      "shaman-lightning-shield",
      "shaman-call-elements",
      "shaman-purge",
    ],
  },
  {
    id: "mage",
    label: "Mage",
    hint: "Bolts, sheep, Counterspell",
    specs: [
      { id: "all", label: "All specs", hint: "Every mage" },
      { id: "arcane", label: "Arcane", hint: "Arcane Blast, missiles" },
      { id: "fire", label: "Fire", hint: "Fireball, Heating Up" },
      { id: "frost", label: "Frost", hint: "Frostbolt, Ice Lance" },
    ],
    categories: ["all", "essential", "leveling", "combat", "pvp", "utility"],
    starters: [
      "mage-frostbolt",
      "mage-counterspell",
      "mage-polymorph",
      "mage-blink",
      "mage-frost-nova",
      "mage-ice-block",
      "mage-remove-curse",
      "mage-evocation",
    ],
  },
  {
    id: "warlock",
    label: "Warlock",
    hint: "Pet, DoTs, Fear",
    specs: [
      { id: "all", label: "All specs", hint: "Every warlock" },
      { id: "affliction", label: "Affliction", hint: "DoTs, Wrack" },
      { id: "demonology", label: "Demonology", hint: "Pet, Demonic Pact" },
      { id: "destruction", label: "Destruction", hint: "Incinerate, burst" },
    ],
    categories: ["all", "essential", "pet", "leveling", "combat", "pvp", "utility"],
    starters: [
      "warlock-shadowbolt-pet",
      "warlock-corruption",
      "warlock-bane-agony",
      "warlock-fear",
      "warlock-lifetap",
      "warlock-healthstone",
      "warlock-pet-care",
      "warlock-deathcoil",
    ],
  },
  {
    id: "druid",
    label: "Druid",
    hint: "Forms, HoTs, bleeds",
    specs: [
      { id: "all", label: "All specs", hint: "Every druid" },
      { id: "balance", label: "Balance", hint: "Moonfire, Eclipse" },
      { id: "feral", label: "Feral", hint: "Cat, Bear, Lacerate" },
      { id: "restoration", label: "Restoration", hint: "HoTs, Wild Growth" },
    ],
    categories: ["all", "essential", "heal", "form", "leveling", "combat", "tank", "pvp", "utility"],
    starters: [
      "druid-rejuv",
      "druid-moonfire",
      "druid-growl",
      "druid-prowl",
      "druid-roots",
      "druid-innervate",
      "druid-rebirth",
      "druid-barkskin",
    ],
  },
];

export function classMeta(id: ClassId) {
  return CLASS_META.find((c) => c.id === id) ?? CLASS_META[0];
}

export function isClassId(value: unknown): value is ClassId {
  return CLASS_IDS.includes(value as ClassId);
}

export const MACROS: Macro[] = [
  ...WARRIOR_MACROS.map((m) => ({ ...m, classId: "warrior" as const })),
  ...PALADIN_MACROS,
  ...HUNTER_MACROS,
  ...ROGUE_MACROS,
  ...PRIEST_MACROS,
  ...SHAMAN_MACROS,
  ...MAGE_MACROS,
  ...WARLOCK_MACROS,
  ...DRUID_MACROS,
];

export function macroText(macro: Macro): string {
  return macro.lines.map((l) => l.code).join("\n");
}

export function findMacro(id: string | undefined): Macro | undefined {
  if (!id) return undefined;
  return MACROS.find((m) => m.id === id);
}

export function macrosFor(classId: ClassId): Macro[] {
  return MACROS.filter((m) => m.classId === classId);
}

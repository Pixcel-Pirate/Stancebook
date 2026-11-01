// Run: node --experimental-strip-types scripts/armory.gen.ts
// Rebuilds src/data/armory.json from wowsims' item database, which is generated from Wowhead's
// Classic tooltips (names, icons, slots, drops). Only original Classic items are kept (id < 24000),
// so Season of Discovery and later items never get in.
import fs from "node:fs";

const DB = "https://raw.githubusercontent.com/wowsims/classic/master/assets/database/db.json";
type Src = Record<string, { npcId?: number; zoneId?: number }>;
type Item = {
  id: number; name: string; icon: string; type: number; quality: number; armorType?: number;
  weaponType?: number; handType?: number; rangedWeaponType?: number; classAllowlist?: number[];
  factionRestriction?: number; setId?: number; setName?: string; sources?: Src[];
};
const db = (await (await fetch(DB)).json()) as { items: Item[]; zones: { id: number; name: string }[]; npcs: { id: number; name: string }[] };
const zone = new Map(db.zones.map((z) => [z.id, z.name]));
const npc = new Map(db.npcs.map((n) => [n.id, n.name]));
const items = db.items.filter((i) => i.id < 24000);

const CLASS = [, "druid", "hunter", "mage", "paladin", "priest", "rogue", "shaman", "warlock", "warrior"];
const ARMOR = [, "cloth", "leather", "mail", "plate"];
const SLOT = [, "Head", "Neck", "Shoulder", "Back", "Chest", "Wrist", "Hands", "Waist", "Legs", "Feet", "Finger", "Trinket", "Weapon", "Ranged"];
const WEAPON = [, "Axe", "Dagger", "Fist Weapon", "Mace", "Held in Off-hand", "Polearm", "Shield", "Staff", "Sword"];
const HAND = [, "Main Hand", "One-Hand", "Off Hand", "Two-Hand"];
const RANGED = [, "Bow", "Crossbow", "Gun", "Idol", "Libram", "Thrown", "Totem", "Wand"];
const FACTION = [, "Alliance", "Horde"];

function source(i: Item) {
  const s = i.sources?.[0];
  if (!s) return "";
  const [kind, v] = Object.entries(s)[0];
  const where = zone.get(v.zoneId ?? 0) ?? "";
  if (kind === "drop") return ["Drop", npc.get(v.npcId ?? 0), where].filter(Boolean).join(" · ");
  return { quest: "Quest reward", crafted: "Crafted", soldBy: "Vendor", rep: "Reputation vendor" }[kind] ?? "";
}

// Dungeon sets 1 and 2 have no class lock in the data, so their class comes from the set.
const SET_CLASS: Record<number, string> = {
  181: "mage", 182: "priest", 183: "warlock", 184: "rogue", 185: "druid", 186: "hunter", 187: "shaman", 188: "paladin", 189: "warrior",
  511: "warrior", 512: "rogue", 513: "druid", 514: "priest", 515: "hunter", 516: "paladin", 517: "mage", 518: "warlock", 519: "shaman",
};
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const GROUPS: [string, number[]][] = [
  ["Tier 3 · Naxxramas", range(521, 530)],
  ["Tier 2.5 · Temple of Ahn'Qiraj", [493, 496, 497, 499, 501, 503, 505, 507, 509]],
  ["Tier 2 · Blackwing Lair, Onyxia, Molten Core", range(210, 218)],
  ["Tier 1 · Molten Core", range(201, 209)],
  ["Ruins of Ahn'Qiraj", [494, 495, 498, 500, 502, 504, 506, 508, 510]],
  ["Zul'Gurub", [...range(474, 482), ...range(461, 466)]],
  ["Dungeon Set 2 (Tier 0.5)", range(511, 519)],
  ["Dungeon Set 1 (Tier 0)", range(181, 189)],
  ["PvP · Epic (Rank 12-13)", [...range(383, 398), 402]],
  ["PvP · Rare (Rank 7-10)", [281, 282, 301, ...range(341, 348), 361, 362, 381, 382, 401, 522, ...range(537, 551)]],
  ["PvP · Arathi Basin", [...range(467, 473), ...range(483, 488)]],
  ["Crafted", [141, 142, 143, 144, 321, 421, 441, 442, 443, 444, 489, 490, 491]],
];

const bySet = new Map<number, Item[]>();
for (const i of items) if (i.setId) bySet.set(i.setId, [...(bySet.get(i.setId) ?? []), i]);
const grouped = new Set(GROUPS.flatMap(([, ids]) => ids));
GROUPS.push(["Dungeon and world sets", [...bySet.keys()].filter((id) => !grouped.has(id)).sort((a, b) => a - b)]);

const sets = GROUPS.flatMap(([group, ids]) =>
  ids.filter((id) => bySet.has(id)).map((id) => {
    const its = bySet.get(id)!.sort((a, b) => a.type - b.type);
    const cls = SET_CLASS[id] ? [SET_CLASS[id]] : [...new Set(its.flatMap((i) => i.classAllowlist ?? []))].map((c) => CLASS[c]);
    const armor = its.map((i) => ARMOR[i.armorType ?? 0]).find(Boolean) ?? null;
    // PvP sets often lack the faction flag, but their rank title gives it away.
    const name = its[0].setName ?? "";
    const faction = its.map((i) => FACTION[i.factionRestriction ?? 0]).find(Boolean) ??
      (/^(Field Marshal|Lieutenant Commander|The Highlander)/.test(name) ? "Alliance" : /^(Warlord|Champion|The Defiler)/.test(name) ? "Horde" : null);
    return {
      id, name, group, cls, armor, faction,
      items: its.map((i) => ({ id: i.id, n: i.name, i: i.icon, s: SLOT[i.type] ?? "", q: i.quality, src: source(i) })),
    };
  }),
);

const seen = new Set<string>();
const weapons = items
  .filter((i) => (i.type === 13 || i.type === 14) && i.quality >= 4 && !seen.has(i.name) && seen.add(i.name))
  .map((i) => ({
    id: i.id, n: i.name, i: i.icon, q: i.quality, src: source(i),
    kind: i.type === 14 ? RANGED[i.rangedWeaponType ?? 0] : WEAPON[i.weaponType ?? 0],
    hand: i.type === 14 ? "Ranged" : HAND[i.handType ?? 0],
  }))
  .filter((w) => w.kind)
  .sort((a, b) => a.kind.localeCompare(b.kind) || b.q - a.q || a.n.localeCompare(b.n));

fs.writeFileSync("src/data/armory.json", JSON.stringify({ sets, weapons }));
console.log(`armory: ${sets.length} sets, ${weapons.length} weapons and shields`);

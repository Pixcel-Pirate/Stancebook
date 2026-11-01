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

// BIS lists come from the Best In Slot Classic addon (github.com/Warkdev/BestInSlotClassic, GPL-2, lists from Fight Club,
// class Discords and similar spreadsheets). Per class/spec/race: lower Priority is better, items carry a content phase.
const BISC = "https://raw.githubusercontent.com/Warkdev/BestInSlotClassic/master/data/";
const lua = async (f: string) => (await fetch(BISC + f)).text();
const links = [...(await lua("bis_data.lua")).matchAll(/ClassId = (\d+), SpecId = (\d+), ItemId = (\d+), Priority = (\d+), OffHand = (\w+), Races = (nil|\{[^}]*\})/g)].map(
  (m) => ({ cls: +m[1], spec: +m[2], id: +m[3], prio: +m[4], off: m[5] === "true", races: m[6] === "nil" ? null : (m[6].match(/\d+/g) ?? []).map(Number) }),
);
const meta = new Map(
  [...(await lua("items.lua")).matchAll(/BIS_ITEMS\[(\d+)\] = \{Phase = ([\d.]+), PvP = (\w+), PvPRank = \d+, Raid = (\w+), WorldBoss = (\w+), TwoHands = (\w+), Faction = (nil|\{ "(\w+)" \}), Slot = (\d+)/g)].map(
    (m) => [+m[1], { phase: +m[2], pvp: m[3] === "true", raid: m[4] === "true", boss: m[5] === "true", twoHand: m[6] === "true", faction: m[8] ?? null, slot: +m[9] }],
  ),
);
// The addon's own spec names, in its SpecId order (higher SpecIds are fire/nature/frost resistance sets, which we skip).
const SPECS: Record<number, [string, string[]]> = {
  1: ["warrior", ["Fury", "Protection (threat)", "Protection (mitigation)"]],
  2: ["paladin", ["Holy", "Protection", "Retribution", "Retribution (spell damage)"]],
  3: ["hunter", ["Ranged", "Melee weave"]],
  4: ["rogue", ["Swords", "Daggers"]],
  5: ["priest", ["Holy / Discipline", "Shadow"]],
  7: ["shaman", ["Restoration", "Enhancement"]],
  8: ["mage", ["Frost / Fire", "Zero spell power", "Alternative"]],
  9: ["warlock", ["Any spec"]],
  11: ["druid", ["Feral tank (value)", "Feral tank (mitigation)", "Feral tank (threat)", "Feral DPS", "Restoration", "Balance"]],
};
const RACE_ID: Record<string, number> = { human: 1, orc: 2, dwarf: 3, nightelf: 4, undead: 5, tauren: 6, gnome: 7, troll: 8 };
const RACE_FACTION: Record<number, string> = { 1: "Alliance", 3: "Alliance", 4: "Alliance", 7: "Alliance", 2: "Horde", 5: "Horde", 6: "Horde", 8: "Horde" };
// Paper-doll order. Rings and trinkets take the best two.
const ORDER: [number, string, number][] = [[1, "Head", 1], [2, "Neck", 1], [3, "Shoulder", 1], [15, "Back", 1], [5, "Chest", 1], [9, "Wrist", 1], [10, "Hands", 1], [6, "Waist", 1], [7, "Legs", 1], [8, "Feet", 1], [11, "Finger", 2], [13, "Trinket", 2], [16, "Main Hand", 1], [17, "Off Hand", 1], [18, "Ranged", 1]];
const itemById = new Map(items.map((i) => [i.id, i]));

/** Best item per slot for one class/spec/race, from what `ok` allows. Ties go to the earlier link, like the addon. */
function pick(cls: number, spec: number, race: number, ok: (m: NonNullable<ReturnType<typeof meta.get>>, id: number) => boolean) {
  const cands = links
    .filter((l) => l.cls === cls && l.spec === spec && (!l.races || l.races.includes(race)) && itemById.has(l.id))
    .flatMap((l) => {
      const m = meta.get(l.id);
      if (!m || !ok(m, l.id) || (m.faction && m.faction !== RACE_FACTION[race])) return [];
      const slot = m.slot === 23 ? 17 : m.slot === 16 && l.off ? 17 : m.slot === 12 ? 11 : m.slot === 14 ? 13 : m.slot;
      return [{ ...l, slot, twoHand: m.twoHand }];
    })
    .sort((a, b) => a.prio - b.prio);
  const best = (slot: number, n: number) => [...new Set(cands.filter((c) => c.slot === slot).map((c) => c.id))].slice(0, n);
  // Two-hander or main hand plus off hand: whichever ranks better; a tie goes to dual wield/shield when an off hand exists.
  const mh = cands.filter((c) => c.slot === 16);
  const top = mh.find((c) => c.prio === mh[0]?.prio && !c.twoHand && best(17, 1).length) ?? mh[0];
  return ORDER.flatMap(([slot, label, n]): [string, number][] => {
    const ids = slot === 16 ? (top ? [top.id] : []) : slot === 17 ? (top?.twoHand ? [] : best(17, 1)) : best(slot, n);
    return ids.map((id) => [label, id]);
  });
}

// Where wowsims has no source, fall back to the addon's own loot, crafting, quest and vendor tables.
const [lootLua, craftLua, questLua, vendorLua] = await Promise.all(["items_loot.lua", "items_craft.lua", "items_quests.lua", "items_vendor.lua"].map(lua));
const has = (text: string, table: string, id: number) => text.includes(`${table}[${id}] =`);
function bisSource(id: number) {
  const craft = craftLua.match(new RegExp(`ITEMS_CRAFT\\[${id}\\] = \\{CraftLabel = "([^"]+)", CraftLevel = "(\\d+)"`));
  if (craft) return `Crafted · ${craft[1]} (${craft[2]})`;
  const loot = lootLua.match(new RegExp(`ITEMS_LOOT\\[${id}\\] = \\{ NPC = \\{(.*)\\} \\};`))?.[1];
  if (loot) {
    const drops = [...loot.matchAll(/Id = (\d+), Zone = (\d+), Chance = ([\d.]+)/g)].sort((a, b) => +b[3] - +a[3]);
    const d = drops.find((x) => npc.has(+x[1])) ?? drops[0];
    if (d) return ["Drop", npc.get(+d[1]), zone.get(+d[2])].filter(Boolean).join(" · ");
  }
  if (has(questLua, "ITEMS_QUEST", id)) return "Quest reward";
  if (has(vendorLua, "ITEMS_VENDOR", id)) return "Vendor";
  return "";
}

const RAIDS = /Molten Core|Onyxia|Blackwing Lair|Zul'Gurub|Ahn'Qiraj|Naxxramas/;
/** Drop location; Naxxramas bosses are missing from wowsims' zone data, but every phase 6 raid item comes from there. */
function srcOf(id: number) {
  const own = source(itemById.get(id)!);
  const src = own && own !== "Drop" ? own : bisSource(id) || own;
  const m = meta.get(id)!;
  if (m.phase === 6 && src === "Drop") return "Drop · Naxxramas";
  if (m.phase === 6 && src === "Quest reward" && m.raid) return "Quest reward · Naxxramas token";
  return src;
}

const bisIds = new Set<number>();
const bis = Object.entries(SPECS).map(([c, [cls, names]]) => ({
  cls,
  specs: names.map((name, k) => {
    const races = Object.entries(RACE_ID).filter(([, r]) => links.some((l) => l.cls === +c && (!l.races || l.races.includes(r))));
    const lists = Object.fromEntries(
      races.map(([id, r]) => {
        // Pre-raid: dungeon, quest, crafted and world gear up to Dire Maul (phase 2.5), nothing from a raid or world boss.
        // The addon's Raid flag misses some raid drops (tier pieces), so the drop zone is checked too.
        const pre = pick(+c, k + 1, r, (m, id) => m.phase <= 2.5 && !m.raid && !m.boss && !m.pvp && !RAIDS.test(srcOf(id)));
        const end = pick(+c, k + 1, r, (m) => !m.pvp);
        for (const [, i] of [...pre, ...end]) bisIds.add(i);
        return [id, { pre, end }];
      }).filter(([, l]) => l.end.length), // races that can't be this class have no entries
    );
    return { name, lists };
  }),
}));
const bisItems = Object.fromEntries(
  [...bisIds].map((id) => {
    const i = itemById.get(id)!;
    return [id, { n: i.name, i: i.icon, q: i.quality, src: srcOf(id), p: meta.get(id)!.phase }];
  }),
);

fs.writeFileSync("src/data/armory.json", JSON.stringify({ sets, weapons, bis, bisItems }));
console.log(`armory: ${sets.length} sets, ${weapons.length} weapons and shields, BIS for ${bis.reduce((n, b) => n + b.specs.length, 0)} specs (${bisIds.size} items)`);

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

// Sets come from the WoW Forever client itself: ItemSet and item tables datamined per beta build by
// github.com/jhunthrop/foreversixty. Only sets with at least one piece in Forever's item table are kept, which drops the
// Season of Discovery leftovers the client still carries, and keeps everything Forever has, Scarlet Enclave's
// Inquisition sets included. The Hyjal sets' pieces aren't in the client yet, so they come from OneForAll_Forever's
// armory (github.com/smoergi/OneForAll_Forever), which also supplies groups, classes and sources for the sets it covers.
// Icons: wowsims' Classic and SoD dbs (Wowhead tooltips), then OneForAll, then a same-named Classic item.
// A piece with no known icon is left out and counted, never drawn as a placeholder.
const FS = "https://raw.githubusercontent.com/jhunthrop/foreversixty/main/data/builds/1.60.1.70707";
const OFA = "https://raw.githubusercontent.com/smoergi/OneForAll_Forever/main/OneForAll/Data/Armory.lua";
const SOD = "https://raw.githubusercontent.com/wowsims/sod/master/assets/database/db.json";
const get = async (u: string) => { const r = await fetch(u); if (!r.ok) throw new Error(`${u}: ${r.status}`); return r; };
type FsItem = { id: number; name: string; quality: number; class_id: number; subclass_id: number; inventory_type: number; faction_restriction: string };
type FsSet = { id: number; name: string; item_ids: number[]; bonuses: { pieces: number; description: string }[] };
const fsSets = (await (await get(`${FS}/sets.json`)).json()) as FsSet[];
const fsItems = new Map(((await (await get(`${FS}/items.json`)).json()) as FsItem[]).map((i) => [i.id, i]));
const sod = (await (await get(SOD)).json()) as { items: Item[] };
const lua = await (await get(OFA)).text();
// ClassicSimForever's item files (built from the Forever client) give icon names for many Forever-only pieces, and map
// the client's icon file ids (which OneForAll stores for some pieces) to names.
const CSF = "https://raw.githubusercontent.com/timhul/ClassicSimForever/main/data/items/";
const csfIcon = new Map<number, string>();
const fileIcon = new Map<number, string>();
for (const f of "back belt boots chest gloves head legs main_hand neck off_hand one_hand ranged relic ring shoulders trinket two_hand wrist".split(" "))
  for (const block of (await (await get(`${CSF}${f}.yaml`)).text()).split(/^- /m)) {
    const id = block.match(/^id: (\d+)/)?.[1], name = block.match(/\n\s*icon_name: ([a-z0-9_]+)/)?.[1], file = block.match(/\n\s*icon: (\d+)/)?.[1];
    if (id && name) csfIcon.set(+id, name);
    if (file && name) fileIcon.set(+file, name);
  }

const str = String.raw`"((?:[^"\\]|\\.)*)"`;
type OfaSet = { g: string; sub: string; side?: string; arm?: string; cls: string[]; pieces: { id: number; n: string; s: string; q: number; i: string; src: string }[] };
const ofa = new Map<number, OfaSet>();
for (const line of lua.split("\n")) {
  const id = line.match(/^\s*\{id=(\d+), n=/)?.[1];
  if (!id) continue;
  const field = (k: string) => line.match(new RegExp(`\\b${k}=${str}`))?.[1] ?? "";
  const items = line.slice(line.indexOf(" i={"));
  ofa.set(+id, {
    g: field("g"), sub: field("sub"), side: field("side") || undefined, arm: field("arm").toLowerCase() || undefined,
    cls: [...(line.match(/cls=\{([^}]*)\}/)?.[1] ?? "").matchAll(/"(\w+)"/g)].map((m) => m[1].toLowerCase()),
    pieces: [...items.matchAll(new RegExp(String.raw`\{(\d+),(?:${str}|nil),"(\w+)",(\d+|nil),(?:"([a-z0-9_]+)"|(\d+)),\{([^}]*)\}`, "g"))].map((m) => ({
      id: +m[1], n: m[2] ?? "", s: m[3], q: +m[4] || 4, i: m[5] ?? fileIcon.get(+m[6]) ?? "", src: [...m[7].matchAll(new RegExp(str, "g"))].map((x) => x[1]).join(" · "),
    })),
  });
}

const known = new Map<number, Item>();
for (const i of [...db.items, ...sod.items]) if (i.icon && !known.has(i.id)) known.set(i.id, i);
const ofaPiece = new Map([...ofa.values()].flatMap((s) => s.pieces.map((p) => [p.id, p] as const)));
const iconByName = new Map<string, string>();
for (const i of db.items) if (i.icon && !iconByName.has(i.name)) iconByName.set(i.name, i.icon);
// Forever-new pieces none of the above cover, with the icon The Forever Era shows (theforeverera.com/en/items/<id>/).
const EXTRA_ICONS: Record<number, string> = { 250591: "inv_pants_plate_04" };
const iconOf = (id: number, name: string) => EXTRA_ICONS[id] || known.get(id)?.icon || csfIcon.get(id) || ofaPiece.get(id)?.i || iconByName.get(name) || "";

// Inventory type -> slot, and the order pieces are listed in.
const INV: Record<number, string> = {
  1: "Head", 3: "Shoulder", 16: "Back", 5: "Chest", 20: "Chest", 4: "Shirt", 9: "Wrist", 10: "Hands", 6: "Waist", 7: "Legs", 8: "Feet",
  2: "Neck", 11: "Finger", 12: "Trinket", 13: "One-Hand", 21: "Main Hand", 17: "Two-Hand", 22: "Off Hand", 14: "Shield", 23: "Held in Off-hand",
  15: "Ranged", 26: "Ranged", 25: "Thrown", 28: "Relic",
};
const ORDER = Object.values(INV);
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const GROUPS: [string, number[]][] = [
  ["WoW Forever · Season 1 (Hyjal)", []],
  ["Scarlet Enclave · Inquisition and tier sets", [...range(1932, 1954), 1963]],
  ["Tier 3 · Naxxramas", [521, ...range(523, 530)]],
  ["Tier 2.5 · Temple of Ahn'Qiraj", [493, 496, 497, 499, 501, 503, 505, 507, 509]],
  ["Tier 2 · Blackwing Lair, Onyxia, Molten Core", range(210, 218)],
  ["Tier 1 · Molten Core", range(201, 209)],
  ["Tier 1 · Forever's level 30 versions", range(2138, 2146)],
  ["Ruins of Ahn'Qiraj", [494, 495, 498, 500, 502, 504, 506, 508, 510]],
  ["Zul'Gurub", [...range(474, 482), ...range(461, 466)]],
  ["Dungeon Set 2 (Tier 0.5)", range(511, 519)],
  ["Dungeon Set 1 (Tier 0)", range(181, 189)],
  ["PvP · Forever rank sets (level 60)", range(1721, 1777)],
  ["PvP · Epic (Rank 12-13)", [...range(383, 398), 402]],
  ["PvP · Rare (Rank 7-10)", [281, 282, 301, ...range(341, 348), 361, 362, 381, 382, 401, 522, ...range(537, 551)]],
  ["PvP · Level 50 (Blood Guard, Knight-Lieutenant)", range(1618, 1665)],
  ["PvP · Arathi Basin", [...range(467, 473), ...range(483, 488)]],
  ["Crafted", [141, 142, 143, 144, 321, 421, 441, 442, 443, 444, 489, 490, 491]],
  ["Dungeon and world sets", []],
];
const groupOf = new Map(GROUPS.flatMap(([g, ids]) => ids.map((id) => [id, g] as const)));
const pickGroup = (id: number) =>
  groupOf.get(id) ?? (ofa.get(id)?.sub === "Forever Tier 1" ? GROUPS[0][0] : ofa.get(id)?.g === "crafted" ? "Crafted" : "Dungeon and world sets");

// Dungeon sets 1 and 2 have no class lock in the data, so their class comes from the set.
const SET_CLASS: Record<number, string> = {
  181: "mage", 182: "priest", 183: "warlock", 184: "rogue", 185: "druid", 186: "hunter", 187: "shaman", 188: "paladin", 189: "warrior",
  511: "warrior", 512: "rogue", 513: "druid", 514: "priest", 515: "hunter", 516: "paladin", 517: "mage", 518: "warlock", 519: "shaman",
  // Forever's level 30 copies of Tier 1 carry no class lock either.
  2138: "mage", 2139: "warlock", 2140: "priest", 2141: "rogue", 2142: "druid", 2143: "shaman", 2144: "hunter", 2145: "paladin", 2146: "warrior",
};

const built = fsSets.flatMap((fset) => {
  const o = ofa.get(fset.id);
  const inClient = fset.item_ids.filter((id) => fsItems.has(id));
  if (!inClient.length && o?.sub !== "Forever Tier 1") return [];
  const all = inClient.map((id) => {
    const f = fsItems.get(id)!;
    return { id, n: f.name, i: iconOf(id, f.name), s: INV[f.inventory_type] ?? "", q: f.quality, src: (id < 24000 ? source(known.get(id) ?? ({} as Item)) : "") || ofaPiece.get(id)?.src || "" };
  });
  const items = all.filter((p) => p.i).sort((a, b) => ORDER.indexOf(a.s) - ORDER.indexOf(b.s));
  const armors = inClient.map((id) => fsItems.get(id)!).filter((f) => f.class_id === 4 && f.inventory_type !== 16).map((f) => ARMOR[f.subclass_id]).filter(Boolean);
  const armor = armors[0] || o?.arm || null;
  const allow = [...new Set(inClient.flatMap((id) => known.get(id)?.classAllowlist ?? []))].map((c) => CLASS[c]!);
  const cls = o?.cls.length ? o.cls : SET_CLASS[fset.id] ? [SET_CLASS[fset.id]] : allow;
  const fac = (side?: string) => (side === "A" ? "Alliance" : side === "H" ? "Horde" : null);
  const faction = fac(o?.side) ?? inClient.map((id) => FACTION[known.get(id)?.factionRestriction ?? 0]).find(Boolean) ??
    (/^(Field Marshal|Lieutenant Commander|Knight-Lieutenant|Knight Lieutenant|The Highlander)/.test(fset.name) ? "Alliance"
      : /^(Warlord|Champion|Blood Guard|The Defiler)/.test(fset.name) ? "Horde" : null);
  return [{
    id: fset.id, name: fset.name, group: pickGroup(fset.id), cls, armor, faction, items,
    missing: fset.item_ids.length - items.length,
    bonuses: fset.bonuses.map((b) => `${b.pieces}: ${b.description}`),
  }];
});
const sets = GROUPS.flatMap(([g]) => built.filter((s) => s.group === g));
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

// BIS lists are The Forever Era's level 60 lists (theforeverera.com/en/bis/<class>/<spec>/60/, beta build 1.60.1.70532,
// updated Oct 25 2026), copied by hand into scripts/forever-bis/<class>-<spec>.txt as Slot|Item|ItemId|Source|Flag.
// The beta was capped at level 30, so these are forecasts. Flag is the site's Forever marker:
// "New in Forever", "Changed" (stats differ from Classic) or "Not in beta client" (may not exist in Forever).
// Names, icons and quality come from wowsims' db; a name mismatch fails the build so a bad copy can't slip in.
const SPEC_ORDER: Record<string, string[]> = {
  warrior: ["arms", "fury", "protection"], paladin: ["holy", "protection", "retribution"],
  hunter: ["beast-mastery", "marksmanship", "survival"], rogue: ["assassination", "combat", "subtlety"],
  priest: ["discipline", "holy", "shadow"], shaman: ["elemental", "enhancement", "restoration"],
  mage: ["arcane", "fire", "frost"], warlock: ["affliction", "demonology", "destruction"],
  druid: ["balance", "feral", "feral-tank", "restoration"],
};
// Items missing from wowsims' Classic db, with the icons The Forever Era shows for them. 250600 is new in Forever
// (epic per its tooltip). 21594 and 23058 are unused Classic raid ids with no source yet; the site has no tooltip
// for them, so epic is assumed from the raid tier they sit in.
const FOREVER_ITEMS: Record<number, { n: string; i: string; q: number }> = {
  250600: { n: "Martyr's Legplates", i: "inv_pants_plate_21", q: 4 },
  21594: { n: "Bracers of the Fallen Son", i: "inv_bracer_11", q: 4 },
  23058: { n: "Life Channeling Necklace", i: "inv_jewelry_necklace_30naxxramas", q: 4 },
};
const allById = new Map(db.items.map((i) => [i.id, i]));
const label = (s: string) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ").replace("Feral Tank", "Feral (tank)");
const bisItems: Record<number, { n: string; i: string; q: number }> = {};
const bis = Object.entries(SPEC_ORDER).map(([cls, specs]) => ({
  cls,
  specs: specs.map((spec) => {
    const rows = fs.readFileSync(`scripts/forever-bis/${cls}-${spec}.txt`, "utf8").trim().split("\n").map((l) => {
      const [slot, name, id, src, flag] = l.split("|");
      const it = FOREVER_ITEMS[+id] ?? allById.get(+id);
      if (!it || ("name" in it ? it.name : it.n) !== name) throw new Error(`${cls}-${spec}: ${name} (${id}) doesn't match the item db`);
      bisItems[+id] = "name" in it ? { n: it.name, i: it.icon, q: it.quality } : it;
      return [slot, +id, src.replace(/ \(Classic data\)/g, ""), flag ?? ""] as const;
    });
    return { name: label(spec), list: rows };
  }),
}));

fs.writeFileSync("src/data/armory.json", JSON.stringify({ sets, weapons, bis, bisItems }));
console.log(`armory: ${sets.length} sets, ${weapons.length} weapons and shields, BIS for ${bis.reduce((n, b) => n + b.specs.length, 0)} specs (${Object.keys(bisItems).length} items)`);

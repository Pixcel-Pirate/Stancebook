import type { Mat, ProfessionGuide } from "@/lib/professions";

// Route and craft counts follow Wowhead's WoW Forever Tailoring leveling guide (updated 2026-11-04).
// Per-craft reagents come from Wowhead's Forever item data (item=<id>&xml createdBy), 2026-11-13; Robe of Power,
// Orange Mageweave Shirt, Black Mageweave Gloves and the linen/wool/silk/mageweave bolts match the guide's totals.
// Counts are averages; a recipe can turn green before its range ends.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const linen = (q: number) => m("Linen Cloth", "inv_fabric_linen_01", q, 2589);
const wool = (q: number) => m("Wool Cloth", "inv_fabric_wool_01", q, 2592);
const silk = (q: number) => m("Silk Cloth", "inv_fabric_silk_01", q, 4306);
const mageweave = (q: number) => m("Mageweave Cloth", "inv_fabric_mageweave_01", q, 4338);
const runecloth = (q: number) => m("Runecloth", "inv_fabric_purplefire_01", q, 14047);
const boltLinen = (q: number) => m("Bolt of Linen Cloth", "inv_fabric_linen_02", q, 2996);
const boltWool = (q: number) => m("Bolt of Woolen Cloth", "inv_fabric_wool_03", q, 2997);
const boltSilk = (q: number) => m("Bolt of Silk Cloth", "inv_fabric_silk_03", q, 4305);
const boltMage = (q: number) => m("Bolt of Mageweave", "inv_fabric_mageweave_03", q, 4339);
const boltRune = (q: number) => m("Bolt of Runecloth", "inv_fabric_purplefire_02", q, 14048);
const coarse = (q: number) => m("Coarse Thread", "inv_fabric_linen_03", q, 2320);
const fine = (q: number) => m("Fine Thread", "inv_fabric_wool_02", q, 2321);
const silken = (q: number) => m("Silken Thread", "inv_fabric_silk_02", q, 4291);
const heavySilken = (q: number) => m("Heavy Silken Thread", "inv_fabric_silk_02", q, 8343);
const rune = (q: number) => m("Rune Thread", "spell_shadow_antimagicshell", q, 14341);
const ironweb = (q: number) => m("Ironweb Spider Silk", "spell_nature_web", q, 14227);
const earth = (q: number) => m("Elemental Earth", "inv_ore_iron_01", q, 7067);
const essAir = (q: number) => m("Essence of Air", "spell_nature_earthbind", q, 7082);
const brilliant = (q: number) => m("Small Brilliant Shard", "inv_enchant_shardbrilliantsmall", q, 14343);

const DARNALL = "Pattern from Darnall, Nighthaven, Moonglade";
const MISHTA = "Pattern from Mishta, Cenarion Hold, Silithus";

export const TAILORING: ProfessionGuide = {
  id: "tailoring",
  name: "Tailoring",
  icon: "trade_tailoring",
  kind: "crafting",
  summary:
    "Cloth armor and bags for every class, and the natural pick for mages, priests and warlocks. You need no gathering profession: cloth drops from humanoids while you level, so pair Tailoring with Enchanting and disenchant what you sew. Wowhead's Forever route uses trainer recipes up to 234, then a handful of vendor patterns. Most of the cost is Runecloth and Rune Thread.",
  trainers: [
    {
      rank: "Apprentice",
      skill: 1,
      where:
        "Lawrence Schneider, Stormwind · Uthrar Threx, Ironforge · Trianna, Darnassus · Eldrin, Eastvale Logging Camp, Elwynn Forest (Alliance) · Snang, the Drag, Orgrimmar · Victor Ward, Undercity · Vhan, Thunder Bluff · Bowen Brisboise, Cold Hearth Manor SW of Brill (Horde) · Othesia Evengale, Valanaar or Taleen Shimmerthread, Shen'dar Village (Skyborne, Zephras Isle)",
    },
    {
      rank: "Journeyman",
      skill: 50,
      level: 10,
      where:
        "Sellandus, Stormwind · Jormund Stonebrow, Ironforge · Me'lynn, Darnassus (Alliance) · Magar, Orgrimmar · Rhiannon Davis, Undercity · Tepa, Thunder Bluff (Horde)",
    },
    { rank: "Expert", skill: 125, level: 20, where: "Georgio Bolero, Stormwind (Alliance) · Josef Gregorian, Undercity (Horde). Costs 50 silver." },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Alliance: Timothy Worthington in Theramore Isle, Dustwallow Marsh (take the boat from Menethil Harbor). Horde: Daryl Stack in Tarren Mill, Hillsbrad Foothills (fly to Tarren Mill from Undercity). Needs skill 200 and level 35. Train it before 214, when Runecloth Belt starts the Artisan recipes.",
    },
  ],
  steps: [
    { from: 1, to: 43, title: "Bolt of Linen Cloth", icon: "inv_fabric_linen_02", id: 2996, count: 54, mats: [linen(2)], note: "The linen belts and capes use these bolts." },
    { from: 43, to: 45, title: "Brown Linen Vest", icon: "inv_shirt_05", id: 2568, count: 2, mats: [boltLinen(1), coarse(1)] },
    { from: 45, to: 70, title: "Linen Belt", icon: "inv_belt_05", id: 7026, count: 33, mats: [boltLinen(1), coarse(1)], where: "Train Journeyman at 50." },
    { from: 70, to: 75, title: "Reinforced Linen Cape", icon: "inv_misc_cape_07", id: 2580, count: 7, mats: [boltLinen(2), coarse(3)] },
    { from: 75, to: 81, title: "Bolt of Woolen Cloth", icon: "inv_fabric_wool_03", id: 2997, count: 12, mats: [wool(3)] },
    { from: 81, to: 100, title: "Woolen Cape", icon: "inv_misc_cape_10", id: 2584, count: 27, mats: [boltWool(1), fine(1)] },
    { from: 100, to: 110, title: "Bolt of Silk Cloth", icon: "inv_fabric_silk_03", id: 4305, count: 10, mats: [silk(4)] },
    { from: 110, to: 125, title: "Double-stitched Woolen Shoulders", icon: "inv_shoulder_06", id: 4314, count: 19, mats: [boltWool(3), fine(2)], where: "Train Expert at 125." },
    { from: 125, to: 132, title: "Azure Silk Hood", icon: "inv_helmet_29", id: 7048, count: 7, mats: [boltSilk(2), m("Blue Dye", "inv_potion_15", 2, 6260), fine(1)] },
    { from: 132, to: 139, title: "Lesser Wizard's Robe", icon: "inv_chest_cloth_17", id: 5766, count: 8, mats: [boltSilk(2), fine(2), m("Spider's Silk", "spell_nature_web", 2, 3182)] },
    { from: 139, to: 140, title: "Formal White Shirt", icon: "inv_shirt_08", id: 4334, count: 1, mats: [boltSilk(3), m("Bleach", "inv_drink_12", 2, 2324), fine(1)] },
    { from: 140, to: 149, title: "Bolt of Mageweave", icon: "inv_fabric_mageweave_03", id: 4339, count: 11, mats: [mageweave(5)], note: "5 Mageweave per bolt on Forever." },
    { from: 149, to: 160, title: "Earthen Vest", icon: "inv_shirt_04", id: 7051, count: 11, mats: [boltSilk(3), earth(1), fine(2)] },
    {
      from: 160,
      to: 170,
      title: "Robe of Power",
      icon: "inv_chest_cloth_02",
      id: 7054,
      count: 10,
      mats: [boltMage(2), earth(2), m("Elemental Water", "inv_potion_03", 2, 7070), m("Elemental Fire", "spell_fire_fire", 2, 7068), m("Elemental Air", "spell_nature_tranquility", 2, 7069), silken(2)],
      note: "Elementals are the priciest part of the route. Check the Auction House first.",
    },
    { from: 170, to: 180, title: "Black Mageweave Vest", icon: "inv_chest_leather_03", id: 9998, count: 10, mats: [boltMage(2), silken(3)] },
    { from: 180, to: 190, title: "Orange Mageweave Shirt", icon: "inv_shirt_orange_01", id: 10056, count: 11, mats: [boltMage(1), m("Orange Dye", "inv_potion_35", 1, 6261), heavySilken(1)] },
    { from: 190, to: 205, title: "Black Mageweave Gloves", icon: "inv_gauntlets_05", id: 10003, count: 17, mats: [boltMage(2), heavySilken(2)], where: "Train Artisan at 200." },
    { from: 205, to: 214, title: "Bolt of Runecloth", icon: "inv_fabric_purplefire_02", id: 14048, count: 11, mats: [runecloth(5)], note: "5 Runecloth per bolt on Forever. Keep every bolt; the rest of the route uses them." },
    { from: 214, to: 234, title: "Runecloth Belt", icon: "inv_belt_15", id: 13856, count: 21, mats: [boltRune(3), rune(1)] },
    { from: 234, to: 250, title: "Runecloth Cloak", icon: "inv_misc_cape_10", id: 13860, count: 18, mats: [boltRune(4), ironweb(1), rune(1)], where: DARNALL },
    { from: 250, to: 260, title: "Runecloth Boots", icon: "inv_boots_05", id: 13864, count: 12, mats: [boltRune(4), ironweb(2), m("Rugged Leather", "inv_misc_leatherscrap_02", 4, 8170), rune(1)], where: DARNALL },
    { from: 260, to: 280, title: "Runecloth Cuffs", icon: "inv_bracer_13", id: 254123, count: 25, mats: [boltRune(5), ironweb(1), rune(1)], where: "Pattern from Pexmit, Mount Hyjal (needs Tailoring 250, bind on pickup)" },
    {
      from: 280,
      to: 285,
      title: "Wisdom of the Timbermaw",
      icon: "inv_belt_09",
      id: 19047,
      count: 8,
      mats: [boltRune(8), m("Essence of Earth", "spell_nature_strengthofearthtotem02", 3, 7076), m("Living Essence", "spell_nature_abolishmagic", 3, 12803), ironweb(2)],
      where: "Pattern from Meilosh, Timbermaw Hold, Felwood (Timbermaw reputation)",
    },
    { from: 285, to: 292, title: "Venomspew Gloves", icon: "inv_gauntlets_18", id: 275604, count: 7, mats: [boltRune(4), brilliant(1), essAir(3), rune(6)], where: MISHTA },
    { from: 292, to: 299, title: "Venomspew Cord", icon: "inv_belt_25", id: 275605, count: 9, mats: [boltRune(6), brilliant(1), essAir(3), rune(6)], where: MISHTA },
    { from: 299, to: 300, title: "Venomspew Footpads", icon: "inv_boots_cloth_04", id: 275606, count: 4, mats: [boltRune(5), brilliant(1), essAir(3), rune(6)], where: MISHTA },
  ],
  tips: [
    "Vendors sell thread and dyes. Buy Coarse Thread in Brill from Abigail Shiel, and buy Rune Thread in bulk before 214.",
    "Buy the vendor patterns before you buy cloth for that range. Runecloth Cuffs and the Venomspew patterns are bind on pickup.",
    "Many Artisan recipes turn grey 25-45 points earlier on Forever than in Classic. If a step stalls, move on to the next recipe.",
    "Keep the cloth you loot while leveling; this route uses about 2,400 Runecloth.",
  ],
};

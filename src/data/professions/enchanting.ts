import type { Mat, ProfessionGuide } from "@/lib/professions";

// Rod and oil reagents come from Wowhead's WoW Forever item data (item=<id>&xml createdBy), 2026-11-13.
// Enchant reagents are spells, so they follow wow-professions.com's Forever route as quoted. Counts are estimates:
// a recipe can stop giving points before the range ends once it turns green.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const mote = (q: number) => m("Mote of Magic", "inv_elemental_mote_mana", q, 247786);
const strange = (q: number) => m("Strange Dust", "inv_enchant_duststrange", q, 10940);
const soul = (q: number) => m("Soul Dust", "inv_enchant_dustsoul", q, 11083);
const vision = (q: number) => m("Vision Dust", "inv_enchant_dustvision", q, 11137);
const dream = (q: number) => m("Dream Dust", "inv_enchant_dustdream", q, 11176);
const illusion = (q: number) => m("Illusion Dust", "inv_enchant_dustillusion", q, 16204);
const leaded = (q: number) => m("Leaded Vial", "inv_alchemy_leadedvial", q, 3372);

const ENCHANT = "trade_engraving";
const OIL_VENDOR =
  "Formula from Enchanting supply vendors: Kithas (Orgrimmar), Nata Dawnstrider (Thunder Bluff), Thaddeus Webb (Undercity) · Tilli Thistlefuzz (Ironforge), Vaean (Darnassus), Jessara Cordell (Stormwind)";
const ROD = "Buy the rod from a Blacksmith or the Auction House.";
const LORELAE = "Formula from Lorelae Wintersong, Nighthaven, Moonglade (both factions)";

export const ENCHANTING: ProfessionGuide = {
  id: "enchanting",
  name: "Enchanting",
  icon: "trade_engraving",
  kind: "crafting",
  summary:
    "For anyone who wants to enchant their own gear or sell enchants. Pair it with Tailoring, or any second profession, and disenchant your green drops for mats. The cheapest Forever route: Mote of Magic recipes for 1-20, then Strange Dust enchants to 130, and dust-based enchants and oils after that. Each rod must be made at its threshold to train the next tier of enchants.",
  trainers: [
    {
      rank: "Apprentice",
      skill: 1,
      where:
        "Jhag (Orgrimmar), Malcomb Wynn (Undercity), Mot Dawnstrider (Thunder Bluff), Pa'zula (Sen'jin Village), Vance Undergloom (Brill inn, upstairs) · Betty Quin (Stormwind Mage Quarter), Thonys Pillarstone (Ironforge), Lalina Summermoon (Darnassus), Alanna Raveneye (Oracle Glade, Teldrassil) · Skyborne: Eaysaa Brightgust (Valanaar), Nasalanna Windsinger (Shen'dar Village). No level requirement on Forever.",
    },
    {
      rank: "Journeyman",
      skill: 50,
      level: 10,
      where:
        "Godan (Orgrimmar), Lavinia Crowe (Undercity), Teg Dawnstrider (Thunder Bluff) · Lucan Cordell (Stormwind), Gimble Thistlefuzz (Ironforge), Taladan (Darnassus)",
    },
    {
      rank: "Expert",
      skill: 125,
      level: 20,
      where:
        "Kitta Firewind, top of the Tower of Azora, Elwynn Forest (Alliance) · Hgarth, Sun Rock Retreat, Stonetalon Mountains (Horde). Costs 50 silver.",
    },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Annora inside Uldaman, Badlands: the only Artisan trainer, for both factions. Use the back entrance, then clear every mob in her area (the scorpids around her) and she appears. Bring a group at level 35. She also teaches most of the 230+ recipes used below.",
    },
  ],
  steps: [
    { from: 1, to: 2, title: "Runed Copper Rod", icon: "inv_staff_goldfeathered_01", id: 6218, count: 1, mats: [m("Copper Rod", "inv_misc_flute_01", 1, 6217), mote(1)], where: "Copper Rod and Mote of Magic are sold by Enchanting supply vendors. In the starting zones only the trainers on Zephras Isle and in Brill sell Motes." },
    { from: 2, to: 20, title: "Enchant Bracer - Inferior Stamina", icon: ENCHANT, count: 18, mats: [mote(1)], note: "New Forever recipe; enchant your own bracers over and over." },
    { from: 20, to: 70, title: "Enchant Chest - Inferior Stamina", icon: ENCHANT, count: 50, mats: [strange(1)], note: "Train Journeyman at 50." },
    { from: 70, to: 100, title: "Enchant Bracer - Minor Stamina", icon: ENCHANT, count: 30, mats: [strange(2)] },
    { from: 100, to: 109, title: "Enchant Cloak - Minor Protection", icon: ENCHANT, count: 9, mats: [strange(2)] },
    { from: 109, to: 110, title: "Runed Silver Rod", icon: "inv_staff_01", id: 6339, count: 1, mats: [m("Silver Rod", "inv_staff_01", 1, 6338), strange(3), m("Lesser Magic Essence", "inv_enchant_essencemagicsmall", 4, 10938), m("Shadowgem", "inv_misc_gem_amethyst_01", 1, 1210)], where: ROD },
    { from: 110, to: 130, title: "Enchant Cloak - Minor Protection", icon: ENCHANT, count: 32, mats: [strange(2)], note: "Train Expert at 125." },
    { from: 130, to: 150, title: "Enchant Boots - Minor Stamina", icon: ENCHANT, count: 20, mats: [strange(4)], note: "Or Enchant Bracer - Lesser Stamina (1 Soul Dust) if Soul Dust is cheaper." },
    { from: 150, to: 151, title: "Runed Golden Rod", icon: "inv_staff_10", id: 11130, count: 1, mats: [m("Golden Rod", "inv_staff_10", 1, 11128), m("Iridescent Pearl", "inv_misc_gem_pearl_02", 1, 5500), m("Greater Astral Essence", "inv_enchant_essenceastrallarge", 1, 11082), soul(1)], where: ROD },
    { from: 151, to: 165, title: "Minor Mana Oil", icon: "inv_potion_98", id: 20745, count: 16, mats: [soul(1), m("Maple Seed", "inv_misc_food_02", 2, 17034), leaded(1)], where: `${OIL_VENDOR}. Maple Seed and Leaded Vial from trade-supply vendors.` },
    { from: 165, to: 200, title: "Enchant Boots - Lesser Agility", icon: ENCHANT, count: 47, mats: [soul(1)] },
    { from: 200, to: 201, title: "Runed Truesilver Rod", icon: "inv_staff_11", id: 11145, count: 1, mats: [m("Truesilver Rod", "inv_staff_11", 1, 11144), m("Black Pearl", "inv_misc_gem_pearl_01", 1, 7971), m("Greater Mystic Essence", "inv_enchant_essencemysticallarge", 1, 11135), vision(1)], where: `Train Artisan first. ${ROD}` },
    { from: 201, to: 220, title: "Lesser Wizard Oil", icon: "inv_potion_103", id: 20746, count: 25, mats: [vision(1), m("Stranglethorn Seed", "inv_misc_food_02", 2, 17035), leaded(1)], where: `${OIL_VENDOR}. Stranglethorn Seed from trade-supply vendors.` },
    { from: 220, to: 225, title: "Enchant Cloak - Greater Defense", icon: ENCHANT, count: 5, mats: [vision(1)] },
    { from: 225, to: 250, title: "Enchant Gloves - Agility", icon: ENCHANT, count: 37, mats: [vision(1)] },
    { from: 250, to: 265, title: "Lesser Mana Oil", icon: "inv_potion_99", id: 20747, count: 20, mats: [dream(1), m("Purple Lotus", "inv_misc_herb_17", 1, 8831), m("Crystal Vial", "inv_alchemy_crystalvial", 1, 8925)], where: "Formula from Kania, upstairs in the Cenarion Hold inn, Silithus. Crystal Vial from Mishta in Cenarion Hold.", note: "Or Enchant Bracer - Greater Strength if you can't reach Silithus." },
    { from: 265, to: 294, title: "Enchant Shield - Greater Stamina", icon: ENCHANT, count: 32, mats: [dream(6)], where: "Formula from Daniel Bartlett (Undercity) · Mythrin'dir (Darnassus)" },
    { from: 294, to: 295, title: "Runed Arcanite Rod", icon: "inv_wand_09", id: 16207, count: 1, mats: [m("Arcanite Rod", "inv_staff_19", 1, 16206), m("Golden Pearl", "inv_misc_gem_pearl_04", 1, 13926), illusion(10), m("Greater Eternal Essence", "inv_enchant_essenceeternallarge", 4, 16203), m("Small Brilliant Shard", "inv_enchant_shardbrilliantsmall", 4, 14343), m("Large Brilliant Shard", "inv_enchant_shardbrilliantlarge", 2, 14344)], where: `${LORELAE}. ${ROD}` },
    { from: 295, to: 300, title: "Enchant Cloak - Superior Defense", icon: ENCHANT, count: 5, mats: [illusion(8)], where: LORELAE },
  ],
  tips: [
    "On Forever, Disenchant is in the Professions window, not the spellbook. Disenchant every green you find; dust is most of the cost.",
    "Rods no longer use the previous rod on Forever, and need fewer dusts and essences than in Classic.",
    "wow-professions.com also lists a Lesser Magic Essence route for the early levels; take it if essences are cheaper than Strange Dust on your server.",
    "Craft counts can run a few over or under; buy a little extra dust for each range.",
  ],
};

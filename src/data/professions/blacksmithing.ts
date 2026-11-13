import type { Mat, ProfessionGuide } from "@/lib/professions";

// Per-craft reagents come from Wowhead's WoW Forever item data (item=<id>&xml createdBy), 2026-11-13.
// Skill ranges and craft counts follow wow-professions.com's Forever route; counts are estimates, since a recipe can
// stop giving points before the range ends once it turns green.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const rough = (q: number) => m("Rough Stone", "inv_stone_06", q, 2835);
const coarse = (q: number) => m("Coarse Stone", "inv_stone_09", q, 2836);
const heavy = (q: number) => m("Heavy Stone", "inv_stone_12", q, 2838);
const solid = (q: number) => m("Solid Stone", "inv_stone_10", q, 7912);
const copper = (q: number) => m("Copper Bar", "inv_ingot_02", q, 2840);
const bronze = (q: number) => m("Bronze Bar", "inv_ingot_bronze", q, 2841);
const iron = (q: number) => m("Iron Bar", "inv_ingot_iron", q, 3575);
const steel = (q: number) => m("Steel Bar", "inv_ingot_steel", q, 3859);
const mithril = (q: number) => m("Mithril Bar", "inv_ingot_06", q, 3860);
const thorium = (q: number) => m("Thorium Bar", "inv_ingot_07", q, 12359);
const medLeather = (q: number) => m("Medium Leather", "inv_misc_leatherscrap_05", q, 2319);
const starRuby = (q: number) => m("Star Ruby", "inv_misc_gem_ruby_02", q, 7910);
const aquamarine = (q: number) => m("Aquamarine", "inv_misc_gem_crystal_02", q, 7909);
const roughGS = (q: number) => m("Rough Grinding Stone", "inv_stone_grindingstone_01", q, 3470);
const coarseGS = (q: number) => m("Coarse Grinding Stone", "inv_stone_grindingstone_02", q, 3478);
const heavyGS = (q: number) => m("Heavy Grinding Stone", "inv_stone_grindingstone_03", q, 3486);
const solidGS = (q: number) => m("Solid Grinding Stone", "inv_stone_grindingstone_04", q, 7966);

const DEROTAIN = "Plans from Derotain Mudsipper's quests in Gadgetzan, Tanaris (level 50; the quests also take Thorium Bars)";

export const BLACKSMITHING: ProfessionGuide = {
  id: "blacksmithing",
  name: "Blacksmithing",
  icon: "trade_blacksmithing",
  kind: "crafting",
  summary:
    "The cheapest trainer-and-quest route from 1 to 300 on WoW Forever. Pair it with Mining so you can smelt your own bars. Make every grinding stone the route asks for; later steps use them.",
  trainers: [
    { rank: "Apprentice", skill: 1, where: "Any Blacksmithing trainer. No level requirement on Forever." },
    { rank: "Journeyman", skill: 50, level: 10, where: "Capital-city trainers, or Zephras Isle" },
    { rank: "Expert", skill: 125, level: 20, where: "Bengus Deepforge in the Great Forge, Ironforge (Alliance) · Saru Steelfury in the Valley of Honor, Orgrimmar (Horde)" },
    { rank: "Artisan", skill: 200, level: 35, where: "Brikk Keencraft in Booty Bay, Stranglethorn Vale. Same trainer for both factions." },
  ],
  steps: [
    { from: 1, to: 25, title: "Rough Sharpening Stone", icon: "inv_stone_sharpeningstone_01", id: 2862, count: 30, mats: [rough(1)] },
    { from: 25, to: 50, title: "Rough Grinding Stone", icon: "inv_stone_grindingstone_01", id: 3470, count: 30, mats: [rough(2)], note: "Keep 10 for the gauntlets." },
    { from: 50, to: 70, title: "Coarse Grinding Stone", icon: "inv_stone_grindingstone_02", id: 3478, count: 36, mats: [coarse(2)], note: "Keep all 36 for the bronze bracers." },
    { from: 70, to: 75, title: "Runed Copper Gauntlets", icon: "inv_gauntlets_04", id: 3472, count: 5, mats: [copper(8), roughGS(2)] },
    { from: 75, to: 95, title: "Runed Copper Belt", icon: "inv_belt_03", id: 2857, count: 23, mats: [copper(10)] },
    { from: 95, to: 100, title: "Patterned Bronze Bracers", icon: "inv_bracer_07", id: 2868, count: 5, mats: [bronze(5), coarseGS(2)] },
    { from: 100, to: 112, title: "Heavy Grinding Stone", icon: "inv_stone_grindingstone_03", id: 3486, count: 20, mats: [heavy(3)], note: "Keep them for the Golden Scale Bracers." },
    { from: 112, to: 125, title: "Patterned Bronze Bracers", icon: "inv_bracer_07", id: 2868, count: 13, mats: [bronze(5), coarseGS(2)] },
    { from: 125, to: 140, title: "Bronze Shortsword", icon: "inv_sword_04", id: 2850, count: 24, mats: [bronze(5), m("Weak Flux", "inv_misc_ammo_gunpowder_02", 4, 2880), medLeather(2)], where: "Train Expert first. Weak Flux is sold by trade-supply vendors." },
    { from: 140, to: 150, title: "Bronze Warhammer", icon: "inv_hammer_18", id: 7956, count: 10, mats: [bronze(8), m("Strong Flux", "inv_misc_ammo_gunpowder_01", 1, 3466), medLeather(1)] },
    { from: 150, to: 175, title: "Green Iron Bracers", icon: "inv_bracer_06", id: 3835, count: 30, mats: [iron(6), m("Green Dye", "inv_potion_12", 1, 2605)], where: "Green Dye is sold by trade-supply vendors." },
    { from: 175, to: 180, title: "Solid Grinding Stone", icon: "inv_stone_grindingstone_04", id: 7966, count: 8, mats: [solid(4)], note: "Keep 6 for the Heavy Mithril Axe." },
    { from: 180, to: 195, title: "Golden Scale Bracers", icon: "inv_bracer_10", id: 6040, count: 20, mats: [steel(5), heavyGS(2)], note: "Needs 40 Heavy Grinding Stones: the 20 you saved plus 20 more." },
    { from: 195, to: 210, title: "Mithril Plate Pants", icon: "inv_pants_04", id: 7920, count: 17, mats: [mithril(12)], note: "Called Mithril Scale Pants in original Classic." },
    { from: 210, to: 215, title: "Heavy Mithril Axe", icon: "inv_axe_14", id: 7941, count: 6, mats: [mithril(12), m("Citrine", "inv_misc_gem_opal_02", 2, 3864), solidGS(1), m("Heavy Leather", "inv_misc_leatherscrap_07", 4, 4234)] },
    { from: 215, to: 225, title: "Heavy Mithril Breastplate", icon: "inv_chest_plate10", id: 7930, count: 10, mats: [mithril(16)], note: "Train Artisan before 225." },
    { from: 225, to: 230, title: "Dense Sharpening Stone", icon: "inv_stone_sharpeningstone_05", id: 12404, count: 5, mats: [m("Dense Stone", "inv_misc_stonetablet_07", 1, 12365)] },
    { from: 230, to: 240, title: "Heavy Mithril Boots", icon: "inv_boots_plate_01", id: 7933, count: 16, mats: [mithril(14), m("Thick Leather", "inv_misc_leatherscrap_08", 4, 4304)] },
    { from: 240, to: 245, title: "Imperial Plate Belt", icon: "inv_belt_01", id: 12424, count: 5, mats: [thorium(22), m("Rugged Leather", "inv_misc_leatherscrap_02", 6, 8170), aquamarine(1)], where: DEROTAIN },
    { from: 245, to: 270, title: "Imperial Plate Bracers", icon: "inv_bracer_19", id: 12425, count: 27, mats: [thorium(20), starRuby(1)], where: DEROTAIN },
    { from: 270, to: 290, title: "Imperial Plate Boots", icon: "inv_boots_plate_01", id: 12426, count: 20, mats: [thorium(34), starRuby(1), aquamarine(1)], where: DEROTAIN },
    { from: 290, to: 300, title: "Imperial Plate Leggings", icon: "inv_pants_04", id: 12429, count: 10, mats: [thorium(44), starRuby(2)], where: DEROTAIN },
  ],
  tips: [
    "Steel Bar is smelted from 1 Iron Bar and 1 Coal (Mining 165), or bought.",
    "Under level 50, the Imperial Plate quests aren't open yet: Magnus Frostwake in Western Plaguelands sells Ebon Shiv and Ornate Thorium Handaxe plans to cover 240-270.",
    "Counts can run a few over or under; buy a little extra Thorium for the last 30 points.",
  ],
};

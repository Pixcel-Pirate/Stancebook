import type { Mat, ProfessionGuide } from "@/lib/professions";

// Per-craft reagents come from Wowhead's WoW Forever item data (item=<id>&xml createdBy), 2026-11-13.
// Skill ranges and craft counts follow wow-professions.com's Forever route; counts are estimates, since a recipe can
// stop giving points before the range ends once it turns green.
// The leather-upgrade steps are titled "... (from scraps/leather)" on purpose: materialTotals would otherwise net Light,
// Medium and Heavy Leather against those steps and expand the shortfall into scraps, when you skin or buy leather instead.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const lightLeather = (q: number) => m("Light Leather", "inv_misc_leatherscrap_03", q, 2318);
const medLeather = (q: number) => m("Medium Leather", "inv_misc_leatherscrap_05", q, 2319);
const heavyLeather = (q: number) => m("Heavy Leather", "inv_misc_leatherscrap_07", q, 4234);
const thickLeather = (q: number) => m("Thick Leather", "inv_misc_leatherscrap_08", q, 4304);
const ruggedLeather = (q: number) => m("Rugged Leather", "inv_misc_leatherscrap_02", q, 8170);
const salt = (q: number) => m("Salt", "inv_misc_dust_02", q, 4289);
const coarseThread = (q: number) => m("Coarse Thread", "inv_fabric_linen_03", q, 2320);
const fineThread = (q: number) => m("Fine Thread", "inv_fabric_wool_02", q, 2321);
const silkenThread = (q: number) => m("Silken Thread", "inv_fabric_silk_02", q, 4291);
const runeThread = (q: number) => m("Rune Thread", "spell_shadow_antimagicshell", q, 14341);
const curedLight = (q: number) => m("Cured Light Hide", "inv_misc_pelt_wolf_01", q, 4231);
const curedMedium = (q: number) => m("Cured Medium Hide", "inv_misc_pelt_bear_02", q, 4233);
const curedHeavy = (q: number) => m("Cured Heavy Hide", "inv_misc_pelt_wolf_02", q, 4236);

const SUPPLY = "Salt and thread are sold by trade-supply and leatherworking-supply vendors.";

export const LEATHERWORKING: ProfessionGuide = {
  id: "leatherworking",
  name: "Leatherworking",
  icon: "inv_misc_armorkit_17",
  kind: "crafting",
  summary:
    "The cheapest trainer-and-vendor route from 1 to 300 on WoW Forever, good for any leather or mail wearer (Rogue, Druid, Hunter, Shaman) and anyone who wants armor kits. Pair it with Skinning: almost every step is leather you skin yourself, plus vendor thread, salt and dye.",
  trainers: [
    {
      rank: "Apprentice",
      skill: 1,
      where:
        "Randal Worth (Stormwind), Gretta Finespindle (Ironforge), Darianna (Darnassus), Adele Fielder (Crystal Lake, NE of Goldshire), Nadyia Maneweaver (Teldrassil, road to Darnassus) · Kamari (Orgrimmar), Dan Golthas (Undercity), Mak (Thunder Bluff), Chaw Stronghide (Bloodhoof Village), Shelene Rhobart (SE of Brill) · Skyborne: Emerii Tallgust (Valanaar) or Indari Sunseam (Shen'dar Village), Zephras Isle",
    },
    {
      rank: "Journeyman",
      skill: 50,
      level: 10,
      where: "Simon Tanner (Stormwind), Fimble Finespindle (Ironforge), Faldron (Darnassus) · Karolek (Orgrimmar), Arthur Moore (Undercity), Tarn (Thunder Bluff)",
    },
    {
      rank: "Expert",
      skill: 125,
      level: 20,
      where: "Telonis in Darnassus (Alliance) · Una in Thunder Bluff (Horde). Costs 50s.",
    },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Drakk Stonehand at Aerie Peak, The Hinterlands (Alliance) · Hahrana Ironhide at Camp Mojache, Feralas (Horde). Train Artisan at 200 (needed to go past 225): Nightscape Pants is taught only here, not by the Expert trainers. Specializations (Dragonscale, Elemental, Tribal) open at 225, level 40.",
    },
  ],
  steps: [
    { from: 1, to: 30, title: "Light Leather (from scraps)", icon: "inv_misc_leatherscrap_03", id: 2318, count: 35, mats: [m("Ruined Leather Scraps", "inv_misc_pelt_bear_ruin_05", 3, 2934)], note: "Keep the leather for the next steps." },
    { from: 30, to: 55, title: "Cured Light Hide", icon: "inv_misc_pelt_wolf_01", id: 4231, count: 27, mats: [m("Light Hide", "inv_misc_pelt_wolf_ruin_02", 1, 783), salt(1)], where: SUPPLY, note: "Keep 24 for the Light Leather Pants." },
    { from: 55, to: 75, title: "Embossed Leather Gloves", icon: "inv_gauntlets_05", id: 4239, count: 21, mats: [lightLeather(3), coarseThread(2)] },
    { from: 75, to: 80, title: "Medium Leather (from light)", icon: "inv_misc_leatherscrap_05", id: 2319, count: 8, mats: [lightLeather(4)], note: "Keep the leather for the Hillman's gloves." },
    { from: 80, to: 90, title: "Cured Medium Hide", icon: "inv_misc_pelt_bear_02", id: 4233, count: 10, mats: [m("Medium Hide", "inv_misc_pelt_boar_ruin_02", 1, 4232), salt(1)], note: "Keep all 10 for the Dark Leather Belt." },
    { from: 90, to: 100, title: "Fine Leather Belt", icon: "inv_belt_04", id: 4246, count: 19, mats: [lightLeather(6), coarseThread(2)], note: "Keep 10 for the Dark Leather Belt." },
    { from: 100, to: 115, title: "Light Leather Pants", icon: "inv_pants_02", id: 7282, count: 24, mats: [lightLeather(10), curedLight(1), fineThread(1)] },
    { from: 115, to: 125, title: "Dark Leather Belt", icon: "inv_belt_03", id: 4249, count: 10, mats: [m("Fine Leather Belt", "inv_belt_04", 1, 4246), curedMedium(1), fineThread(2), m("Gray Dye", "inv_drink_10", 1, 4340)], where: "Gray Dye is sold by trade-supply vendors." },
    { from: 125, to: 130, title: "Heavy Leather (from medium)", icon: "inv_misc_leatherscrap_07", id: 4234, count: 7, mats: [medLeather(5)], note: "Train Expert first. Keep the leather for later steps." },
    { from: 130, to: 143, title: "Cured Heavy Hide", icon: "inv_misc_pelt_wolf_02", id: 4236, count: 30, mats: [m("Heavy Hide", "inv_misc_pelt_wolf_ruin_03", 1, 4235), salt(3)], note: "Keep all 30 for the shoulders and gloves." },
    { from: 143, to: 155, title: "Hillman's Leather Gloves", icon: "inv_gauntlets_05", id: 4247, count: 17, mats: [medLeather(14), fineThread(4)] },
    { from: 155, to: 170, title: "Barbaric Shoulders", icon: "inv_shoulder_08", id: 5964, count: 15, mats: [heavyLeather(8), curedHeavy(1), fineThread(2)] },
    { from: 170, to: 185, title: "Guardian Gloves", icon: "inv_gauntlets_05", id: 5966, count: 15, mats: [heavyLeather(4), curedHeavy(1), silkenThread(1)] },
    { from: 185, to: 195, title: "Barbaric Harness", icon: "inv_chest_leather_04", id: 5739, count: 16, mats: [heavyLeather(14), fineThread(2), m("Iron Buckle", "inv_misc_armorkit_12", 1, 7071)], where: "Iron Buckles are made by Blacksmiths (2 per Iron Bar); buy them on the Auction House or from a friend." },
    { from: 195, to: 205, title: "Nightscape Headband", icon: "inv_belt_24", id: 8176, count: 12, mats: [thickLeather(5), silkenThread(2)] },
    { from: 205, to: 235, title: "Nightscape Pants", icon: "inv_pants_11", id: 8193, count: 36, mats: [thickLeather(14), silkenThread(4)], where: "Taught by the Artisan trainers, not the Expert trainers in Thunder Bluff or Darnassus." },
    { from: 235, to: 265, title: "Wicked Leather Gauntlets", icon: "inv_gauntlets_31", id: 15083, count: 36, mats: [ruggedLeather(8), m("Black Dye", "inv_potion_63", 1, 2325), runeThread(1)], where: "Pattern from Werg Thickblade in Tirisfal Glades (Horde) or Leonard Porter in Western Plaguelands (Alliance). Rune Thread and Black Dye are sold by supply vendors." },
    { from: 265, to: 300, title: "Runic Leather Headband", icon: "inv_misc_bandage_11", id: 15094, count: 53, mats: [ruggedLeather(14), m("Runecloth", "inv_fabric_purplefire_01", 10, 14047), runeThread(1)], where: "Pattern from Jase Farlane at Light's Hope Chapel, Eastern Plaguelands (both factions)." },
  ],
  tips: [
    "The shopping list counts all the Light, Medium and Heavy Leather the route uses; the leather you make from scraps and at 75 and 125 covers about 35 Light, 8 Medium and 7 Heavy of it.",
    "Skin as you level: Light Leather and Hide drop in the 1-20 zones, Medium 20-30, Heavy 30-40, Thick 40-50, Rugged 50-60.",
    "Runecloth is the big cost at the end (530). If you already own the Blue Suede Hat pattern, 15 hats (16 Rugged Leather, 4 Blue Dye, 1 Rune Thread each) can replace the headbands from 285 to 300.",
    "Nightscape Pants is the guide's pick over Nightscape Boots for 205-235 because it vendors for more.",
  ],
};

import type { ProfessionGuide } from "@/lib/professions";

// Leather icons from Wowhead Classic item data (wow-classic-items). Farming spots and trainers follow
// wow-professions.com's and Warcraft Tavern's WoW Forever skinning guides, 2026-11-13.
export const SKINNING: ProfessionGuide = {
  id: "skinning",
  name: "Skinning",
  icon: "inv_misc_pelt_wolf_01",
  kind: "gathering",
  summary:
    "Skin every beast you kill. A mob needs 5x its level in Skinning, so move up a zone as soon as the current mobs go green. Pairs with Leatherworking.",
  trainers: [
    { rank: "Apprentice", skill: 1, level: 1, where: "Starting-zone trainers (up to 75), or the \"Pelt Collecting for Beginners\" quest reward on Zephras Isle. Buy a Skinning Knife from a general goods vendor." },
    { rank: "Journeyman", skill: 50, level: 10, where: "Any regular trainer, e.g. Yonn Deepcut in Bloodhoof Village, Rand Rhobart near Undercity, Dranh in Camp Taurajo, Helene Peltskinner in Goldshire, Radnaal Maneweaver outside Darnassus" },
    { rank: "Expert", skill: 125, level: 20, where: "Any trainer listed under Artisan" },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Alliance: Balthus Stoneflayer (Great Forge, Ironforge) · Maris Granger (Old Town, Stormwind) · Eladriel (Craftsmen's Terrace, Darnassus) · Jayla (Silverwind Refuge, Ashenvale). Horde: Thuwd (The Drag, Orgrimmar) · Mooranta (Middle Rise, Thunder Bluff) · Killian Hagey (Rogues' Quarter, Undercity) · Kulleg Stonehorn (Camp Mojache, Feralas). Both: Ishlee Breezewhisper (Valanaar) and Mendalass Tattermend (Shen'dar Village) on Zephras Isle.",
    },
  ],
  steps: [
    {
      from: 1, to: 75, title: "Starting-zone beasts", icon: "inv_misc_leatherscrap_03", id: 2318,
      where: "Mottled Boars in the Valley of Trials, Young and Timber Wolves in Northshire, or any starting zone's beasts until about level 10.",
      note: "Light Leather and Ruined Leather Scraps.",
    },
    {
      from: 75, to: 125, title: "Loch Modan or The Barrens (level 16-18)", icon: "inv_misc_leatherscrap_03", id: 2318,
      where: "Alliance: Elder Mountain Boars, Black Bear Patriarchs and Loch Crocolisks in Loch Modan. Horde: Sunscale Scytheclaws, Zhevra Chargers and Ornery Plainstriders at the raptor camp west of Northwatch Hold, The Barrens.",
      note: "Train Expert at 125.",
    },
    {
      from: 125, to: 150, title: "Wetlands raptors (level 25-27)", icon: "inv_misc_leatherscrap_05", id: 2319,
      where: "Mottled Scytheclaws and Razormaws at Whelgar's Excavation Site, Wetlands. Horde can use the Southern Barrens instead.",
      note: "Medium Leather.",
    },
    {
      from: 150, to: 225, title: "Hillsbrad yetis or Duskwood worgen (level 26-32)", icon: "inv_misc_leatherscrap_07", id: 4234,
      where: "Cave and Ferocious Yetis in the Foothill Caverns, Hillsbrad (from Tarren Mill or Southshore). Or Nightbane worgen around Roland's Doom and the Rotting Orchard, Duskwood. Then Thousand Needles' Shimmering Flats or Arathi Highlands as you pass 175.",
      note: "Heavy Leather. Train Artisan at 200.",
    },
    {
      from: 225, to: 280, title: "Feral Scar yetis, Feralas (level 43-46)", icon: "inv_misc_leatherscrap_08", id: 4304,
      where: "The yeti cave in Feral Scar Vale, southern Feralas (from Camp Mojache or Feathermoon Stronghold).",
      note: "Thick Leather.",
    },
    {
      from: 280, to: 300, title: "Un'Goro diemetradons and pterrordax (level 50-55)", icon: "inv_misc_leatherscrap_02", id: 8170,
      where: "Western Un'Goro Crater; fly to Marshal's Refuge first. Devilsaurs drop Devilsaur Leather.",
      note: "Rugged Leather.",
    },
  ],
  tips: [
    "Forever adds Fel Hide, Fel Leather and Pristine leathers and scales.",
    "+Skinning: Enchant Gloves - Skinning (+5), Advanced Skinning (+10), Keen Skinning Knife (+3), Cartilage Shapers (+4).",
  ],
};

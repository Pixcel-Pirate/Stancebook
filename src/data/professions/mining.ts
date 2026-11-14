import type { ProfessionGuide } from "@/lib/professions";

// Node skill levels and icons from Wowhead Classic item data (wow-classic-items). Routes and trainers follow
// wow-professions.com's and Warcraft Tavern's WoW Forever mining guides, 2026-11-13.
export const MINING: ProfessionGuide = {
  id: "mining",
  name: "Mining",
  icon: "trade_mining",
  kind: "gathering",
  summary:
    "Mine every vein that isn't grey and smelt as you go: smelting gives points too. Pairs with Blacksmithing or Engineering, or sell the bars.",
  trainers: [
    { rank: "Apprentice", skill: 1, level: 1, where: "Starting-zone trainers (up to 75), or the \"Mining for Dummies\" quest reward on Zephras Isle" },
    { rank: "Journeyman", skill: 50, level: 10, where: "Any regular trainer, e.g. Krunn in Razor Hill or Yarr Hammerstone in Kharanos. Starting-area junior trainers don't teach it." },
    { rank: "Expert", skill: 125, level: 20, where: "Any capital or town trainer listed under Artisan" },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Alliance: Gelman Stonehand (Dwarven District, Stormwind) · Geofram Bouldertoe (The Great Forge, Ironforge) · Kurdram Stonehammer (Auberdine, Darkshore). Horde: Makaru (Valley of Honor, Orgrimmar) · Brek Stonehoof (Middle Rise, Thunder Bluff) · Brom Killian (The War Quarter, Undercity). Both: Pikkle (Gadgetzan, Tanaris) · Halavuul Cragwind (Valanaar) and Messana Crestwind (Shen'dar Village) on Zephras Isle.",
    },
  ],
  steps: [
    {
      from: 1, to: 65, title: "Copper Vein", icon: "inv_ore_copper_01", id: 2770,
      where: "Horde: Durotar (smelt in Razor Hill), Mulgore, Tirisfal Glades. Alliance: Elwynn Forest (smelt in Goldshire), Dun Morogh, Teldrassil. Both: Zephras Isle.",
      note: "Smelt Copper Bars the whole way. Keep about 70 Copper Bars for Bronze later.",
    },
    {
      from: 65, to: 125, title: "Tin Vein and Silver Vein", icon: "inv_ore_tin_01", id: 2771,
      where: "Alliance: the Wetlands cave is best, or Westfall. Horde: the Silverpine Forest cave or Hillsbrad Foothills. Also The Barrens, Ashenvale, Stonetalon Mountains.",
      note: "Tin at 65, Silver at 75. Smelt Tin and Bronze (learned with Journeyman), then Silver from about 105. Train Expert at 125.",
    },
    {
      from: 125, to: 175, title: "Iron Deposit and Gold Vein", icon: "inv_ore_iron_01", id: 2772,
      where: "Thousand Needles if you're around level 30, Arathi Highlands with a mount, then Desolace.",
      note: "Iron at 125, Gold at 155. Learn Smelt Gold at 155. Skip the four Arathi caves at low level.",
    },
    {
      from: 175, to: 245, title: "Mithril Deposit and Truesilver Deposit", icon: "inv_ore_mithril_02", id: 3858,
      where: "The Hinterlands and Tanaris. Badlands, Searing Gorge and Feralas also have lots of Mithril.",
      note: "Mithril at 175, Truesilver at 230. Train Artisan at 200, before 225. Skip the Tanaris caves under level 60.",
    },
    {
      from: 245, to: 275, title: "Small Thorium Vein", icon: "inv_ore_thorium_02", id: 10620,
      where: "Un'Goro Crater, Blasted Lands, Felwood (the Jaedenar cave is worth it; skip Shadow Hold without stealth).",
      note: "Small Thorium at 245. Dark Iron Deposits in Searing Gorge and Burning Steppes also give points until 245.",
    },
    {
      from: 275, to: 300, title: "Rich Thorium Vein", icon: "inv_ore_thorium_02", id: 10620,
      where: "Un'Goro Crater, Eastern Plaguelands, Winterspring, Burning Steppes. Mind the level 57-58 elites in Eastern Plaguelands.",
      note: "Rich Thorium at 275. Forever's Azerothium Bar can be smelted from 275 too.",
    },
  ],
  tips: [
    "Smelting gives skill: copper to 65, tin to 75 and bronze to about 105 can all be done at a forge if you'd rather buy ore.",
    "Forever respawns nodes and mobs quickly, so you rarely need a full loop; outlevel a zone to avoid getting camped.",
    "+Mining: Enchant Gloves - Mining (+2), Enchant Gloves - Advanced Mining (+5), Goblin Mining Helm (+5).",
  ],
};

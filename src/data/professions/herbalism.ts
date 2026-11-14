import type { ProfessionGuide } from "@/lib/professions";

// Herb skill levels and icons from Wowhead Classic item data (wow-classic-items). Routes and trainers follow
// wow-professions.com's and Warcraft Tavern's WoW Forever herbalism guides, 2026-11-13.
export const HERBALISM: ProfessionGuide = {
  id: "herbalism",
  name: "Herbalism",
  icon: "spell_nature_naturetouchgrow",
  kind: "gathering",
  summary:
    "Track herbs and pick everything that isn't grey; most herbs give points for about 50 skill before going green. Feeds Alchemy, and on Forever First Aid's healing potions too.",
  trainers: [
    { rank: "Apprentice", skill: 1, level: 1, where: "Starting-zone trainers (up to 75), or the \"Wild Harvest\" quest reward on Zephras Isle" },
    { rank: "Journeyman", skill: 50, level: 10, where: "Any regular trainer, e.g. Mishiki in Sen'jin Village, Faruza in Brill, Herbalist Pomeroy in Elwynn, Kali Healtouch in Thelsamar, Malorne Bladeleaf in Dolanaar" },
    { rank: "Expert", skill: 125, level: 20, where: "Any trainer listed under Artisan. Needed to pass 150." },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Alliance: Tannysa (Mage Quarter, Stormwind) · Reyna Stonebranch (Great Forge, Ironforge) · Firodren Mooncaller (Temple Gardens, Darnassus) · Brant Jasperbloom (Theramore Isle). Horde: Jandi (The Drag, Orgrimmar) · Komin Winterhoof (Middle Rise, Thunder Bluff) · Martha Alliestar (The Apothecarium, Undercity) · Ruw (Camp Mojache, Feralas). Both: Flora Silverwind (Booty Bay) · Malvor (Nighthaven, Moonglade). Train before Tanaris or Searing Gorge, which have no trainer.",
    },
  ],
  steps: [
    {
      from: 1, to: 70, title: "Peacebloom, Silverleaf, Earthroot", icon: "inv_misc_flower_02", id: 2447,
      where: "Horde: Durotar, Mulgore, Tirisfal Glades. Alliance: Elwynn Forest, Dun Morogh, Teldrassil. Both: Zephras Isle.",
      note: "Earthroot needs 15.",
    },
    {
      from: 70, to: 115, title: "Mageroyal, Briarthorn, Stranglekelp", icon: "inv_misc_root_01", id: 2450,
      where: "Silverpine Forest, The Barrens (Horde) · Loch Modan, Darkshore, Westfall (Alliance). Stranglekelp grows under water.",
      note: "Mageroyal 50, Briarthorn 70, Stranglekelp 85.",
    },
    {
      from: 115, to: 170, title: "Bruiseweed, Wild Steelbloom, Kingsblood, Liferoot", icon: "inv_misc_herb_03", id: 3356,
      where: "Hillsbrad Foothills, Stonetalon Mountains, Wetlands.",
      note: "Bruiseweed 100, Wild Steelbloom 115, Kingsblood 125, Liferoot 150. Train Expert at 125.",
    },
    {
      from: 170, to: 205, title: "Fadeleaf, Goldthorn, Khadgar's Whisker", icon: "inv_misc_herb_08", id: 3358,
      where: "Stranglethorn Vale (north half), Arathi Highlands.",
      note: "Fadeleaf 160, Goldthorn 170, Khadgar's Whisker 185. Train Artisan at 200 before heading south.",
    },
    {
      from: 205, to: 230, title: "Firebloom, Purple Lotus", icon: "inv_misc_herb_19", id: 4625,
      where: "Tanaris, Searing Gorge.",
      note: "Firebloom 205, Purple Lotus 210.",
    },
    {
      from: 230, to: 270, title: "Sungrass, Ghost Mushroom, Golden Sansam", icon: "inv_misc_herb_18", id: 8838,
      where: "The Hinterlands. Ghost Mushrooms grow in the troll caves.",
      note: "Sungrass 230, Ghost Mushroom 245, Golden Sansam 260.",
    },
    {
      from: 270, to: 300, title: "Dreamfoil, Mountain Silversage, Plaguebloom", icon: "inv_misc_herb_dreamfoil", id: 13463,
      where: "Felwood. Un'Goro Crater and Winterspring (Icecap) work too.",
      note: "Gromsblood 250, Dreamfoil 270, Mountain Silversage 280, Plaguebloom 285, Icecap 290, Black Lotus 300.",
    },
  ],
  tips: [
    "Find Herbs turns off when you die; keep it on your action bar.",
    "Forever adds new herbs (Marefoil, Demonsage, Death Lotus) and Scarce bonus herbs (Frilled Lichen, Rosecap, Stranglevine) that drop while picking.",
    "+Herbalism: Enchant Gloves - Herbalism (+2), Advanced Herbalism (+5), Herbalist's Gloves (+5), Goldthorn Tea (+15, Cooking 175).",
    "Tauren Cultivation lets anyone pick the copy it creates.",
  ],
};

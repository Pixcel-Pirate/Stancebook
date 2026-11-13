import type { Mat, ProfessionGuide } from "@/lib/professions";

// Recipes and icons from Wowhead Classic item data (wow-classic-items, createdBy). Route, counts and recipe vendors
// follow Warcraft Tavern's WoW Forever cooking leveling guide, 2026-11-13. Most fish come from the Fishing route.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });

export const COOKING: ProfessionGuide = {
  id: "cooking",
  name: "Cooking",
  icon: "inv_misc_food_15",
  kind: "secondary",
  summary:
    "A fish-first route: catch on the Fishing route and cook the same fish, so both level together. Needs a campfire (Flint and Tinder plus Simple Wood) or a cooking fire.",
  trainers: [
    { rank: "Apprentice", skill: 1, where: "Any Cooking trainer. The Cooking 101 quest after the Camping quest points you to the nearest one." },
    { rank: "Journeyman", skill: 50, level: 10, where: "Any Cooking trainer: Stephen Ryback (Old Town, Stormwind), Daryl Riknussun (Great Forge, Ironforge), Alegorn (Darnassus), Zamja (The Drag, Orgrimmar), Aska Mistrunner (Thunder Bluff), Eunice Burch (Trade Quarter, Undercity), Zerril Softbreeze or Nyalah Brightfire (Zephras Isle)" },
    { rank: "Expert", skill: 125, level: 20, where: "Expert Cookbook from Shandrina in Silverwind Refuge, Ashenvale (Alliance) · Wulan in Shadowprey Village, Desolace (Horde), or the Auction House" },
    { rank: "Artisan", skill: 225, level: 35, where: "Quest \"Clamlette Surprise\" from Dirge Quikcleave in the Gadgetzan inn, Tanaris (both factions). Bring 12 Giant Egg, 10 Zesty Clam Meat and 20 Alterac Swiss." },
  ],
  steps: [
    { from: 1, to: 50, title: "Brilliant Smallfish", icon: "inv_misc_fish_07", id: 6290, count: 55, mats: [m("Raw Brilliant Smallfish", "inv_misc_fish_08", 1, 6291)], where: "Recipe from cooking or fishing vendors, e.g. Catherine Leland (Stormwind), Sewa Mistrunner (Thunder Bluff)" },
    { from: 50, to: 100, title: "Longjaw Mud Snapper", icon: "inv_misc_fish_32", id: 4592, count: 60, mats: [m("Raw Longjaw Mud Snapper", "inv_misc_fish_32", 1, 6289)], where: "Recipe from Tansy Puddlefizz (Ironforge) or Naal Mistrunner (Thunder Bluff)" },
    { from: 100, to: 150, title: "Bristle Whisker Catfish", icon: "inv_misc_fish_30", id: 4593, count: 60, mats: [m("Raw Bristle Whisker Catfish", "inv_misc_fish_30", 1, 6308)], where: "Recipe from Catherine Leland (Stormwind) or Naal Mistrunner (Thunder Bluff)", note: "Use the Expert Cookbook at 125." },
    { from: 150, to: 175, title: "Curiously Tasty Omelet", icon: "inv_egg_04", id: 3665, count: 30, mats: [m("Raptor Egg", "inv_egg_03", 1, 3685), m("Hot Spices", "inv_misc_food_wheat_02", 1, 2692)], where: "Recipe from Kendor Kabonka (Stormwind) or Nerrist (Grom'gol). Raptor Eggs drop from raptors in Arathi, Stranglethorn and Wetlands; Hot Spices from cooking supply vendors." },
    { from: 175, to: 225, title: "Mithril Head Trout", icon: "inv_misc_fish_02", id: 8364, count: 60, mats: [m("Raw Mithril Head Trout", "inv_misc_fish_02", 1, 8365)], where: "Recipe from Tansy Puddlefizz (Ironforge) or Kelsey Yance (Booty Bay)", note: "Do Clamlette Surprise at 225." },
    { from: 225, to: 250, title: "Filet of Redgill", icon: "inv_misc_fish_06", id: 13930, count: 25, mats: [m("Raw Redgill", "inv_misc_fish_06", 1, 13758)], where: "Recipe from Kelsey Yance, Booty Bay" },
    { from: 250, to: 300, title: "Poached Sunscale Salmon", icon: "inv_misc_fish_19", id: 13932, count: 60, mats: [m("Raw Sunscale Salmon", "inv_misc_fish_19", 1, 13760)], where: "Recipe from Gikkix, Steamwheedle Port, Tanaris" },
  ],
  tips: [
    "No fishing? Kaldorei Spider Kabob, Crab Cake, Goblin Deviled Clams, Barbecued Buzzard Wing and Grilled Squid cover the same ranges from mob drops.",
    "Giant Eggs drop from Hinterlands owlbeasts and Tanaris rocs; Zesty Clam Meat from Big-mouth Clams in Tanaris and Azshara; Alterac Swiss from innkeepers.",
    "Forever's crafting window has a \"Has skill up\" filter and Track Recipe, which lists the mats in your quest tracker.",
  ],
};

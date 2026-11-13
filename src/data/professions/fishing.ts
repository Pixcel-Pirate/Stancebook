import type { ProfessionGuide } from "@/lib/professions";

// Fish and lure icons from Wowhead Classic item data (wow-classic-items). Zones, Expert book and Artisan quest follow
// wow-professions.com's WoW Forever fishing guide, 2026-11-13.
export const FISHING: ProfessionGuide = {
  id: "fishing",
  name: "Fishing",
  icon: "trade_fishing",
  kind: "secondary",
  summary:
    "Fish any water that isn't too high for you; if fish keep escaping, add a lure or move to an easier zone. Cook what you catch on the Cooking route to level both.",
  trainers: [
    { rank: "Apprentice", skill: 1, where: "Any Fishing trainer, no level needed. Buy a Fishing Pole and Shiny Baubles from the supply vendor beside them." },
    { rank: "Journeyman", skill: 50, level: 10, where: "Every Fishing trainer: Arnold Leland (Trade District, Stormwind), Grimnur Stonebrand (Forlorn Cavern, Ironforge), Astaia (Darnassus), Lumak (Orgrimmar), Armand Cromwell (Undercity), Kah Mistrunner (Thunder Bluff), Baelann Swiftcurrent or Fenn Fairweather (Zephras Isle)" },
    { rank: "Expert", skill: 125, level: 20, where: "Book \"Expert Fishing - The Bass and You\" from Old Man Heming by the fishing sign at the bottom of Booty Bay, Stranglethorn Vale, or the Auction House. Buy Bright Baubles from him too." },
    { rank: "Artisan", skill: 225, level: 35, where: "Quest \"Nat Pagle, Angler Extreme\" from Nat Pagle at Tidefury Cove, Dustwallow Marsh (both factions). Catch Feralas Ahi (Feralas), Misty Reed Mahi Mahi (Swamp of Sorrows), Sar'theris Striker (Desolace) and Savage Coast Blue Sailfin (Stranglethorn)." },
  ],
  steps: [
    {
      from: 1, to: 75, title: "Starting-zone waters", icon: "inv_misc_fish_08", id: 6291,
      where: "Any lake or river in Dun Morogh, Durotar, Elwynn Forest, Mulgore, Teldrassil, Tirisfal Glades or Zephras Isle. Use Shiny Baubles.",
      note: "Raw Brilliant Smallfish and Slitherskin Mackerel for Cooking 1-50.",
    },
    {
      from: 75, to: 150, title: "Capital cities and 10-20 zones", icon: "inv_misc_fish_30", id: 6308,
      where: "Stormwind, Ironforge, Darnassus, Orgrimmar, Undercity, Thunder Bluff, The Barrens, Darkshore, Loch Modan, Silverpine Forest, Westfall. Nightcrawlers if fish escape.",
      note: "Raw Longjaw Mud Snapper and Bristle Whisker Catfish. Buy the Expert book at 125.",
    },
    {
      from: 150, to: 225, title: "Dustwallow Marsh and 30-40 zones", icon: "inv_misc_fish_02", id: 8365,
      where: "Dustwallow Marsh (near Nat Pagle). Or Alterac Mountains, Arathi Highlands, Desolace, Stranglethorn Vale, Swamp of Sorrows, Thousand Needles.",
      note: "Raw Mithril Head Trout and Rockscale Cod. At 225 do Nat Pagle's quest; use Bright Baubles for the Feralas Ahi.",
    },
    {
      from: 225, to: 250, title: "Feralas and The Hinterlands", icon: "inv_misc_fish_06", id: 13758,
      where: "Inland rivers and lakes of Feralas and The Hinterlands, with Bright Baubles.",
      note: "Raw Redgill for Cooking 225-250.",
    },
    {
      from: 250, to: 300, title: "Tanaris, Un'Goro, Felwood, Western Plaguelands", icon: "inv_misc_fish_19", id: 13760,
      where: "Tanaris coast, Un'Goro Crater, Felwood and Western Plaguelands, with Bright Baubles.",
      note: "Raw Sunscale Salmon for Cooking 250-300.",
    },
  ],
  tips: [
    "Lures: Shiny Bauble +25, Nightcrawlers +50, Bright Baubles +75, Aquadynamic Fish Attractor +100.",
    "Poles: Strong Fishing Pole +5, Big Iron Fishing Pole +20, Nat Pagle's Extreme Angler FC-5000 +25 (Horde), Arcanite Fishing Pole +35 (Stranglethorn tournament; Forever lets several players win).",
    "Forever adds new Uncommon and Rare fish, a Bait and Tackle crafting menu, and a Chef's Knife for preparing Unique Fish.",
  ],
};

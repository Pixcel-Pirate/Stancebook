import type { Mat, ProfessionGuide } from "@/lib/professions";

// Per-craft reagents come from Wowhead's WoW Forever item data (item=<id>&xml createdBy), 2026-11-13.
// Skill ranges and craft counts follow wow-professions.com's Forever route; counts are estimates, since a recipe can
// stop giving points before the range ends once it turns green.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const peacebloom = (q: number) => m("Peacebloom", "inv_misc_flower_02", q, 2447);
const silverleaf = (q: number) => m("Silverleaf", "inv_misc_herb_10", q, 765);
const mageroyal = (q: number) => m("Mageroyal", "inv_jewelry_talisman_03", q, 785);
const earthroot = (q: number) => m("Earthroot", "inv_misc_herb_07", q, 2449);
const briarthorn = (q: number) => m("Briarthorn", "inv_misc_root_01", q, 2450);
const stranglekelp = (q: number) => m("Stranglekelp", "inv_misc_herb_11", q, 3820);
const kingsblood = (q: number) => m("Kingsblood", "inv_misc_herb_03", q, 3356);
const liferoot = (q: number) => m("Liferoot", "inv_misc_root_02", q, 3357);
const khadgar = (q: number) => m("Khadgar's Whisker", "inv_misc_herb_08", q, 3358);
const blindweed = (q: number) => m("Blindweed", "inv_misc_herb_14", q, 8839);
const sungrass = (q: number) => m("Sungrass", "inv_misc_herb_18", q, 8838);
const emptyVial = (q: number) => m("Empty Vial", "inv_potion_84", q, 3371);
const leadedVial = (q: number) => m("Leaded Vial", "inv_potion_85", q, 3372);
const crystalVial = (q: number) => m("Crystal Vial", "inv_potion_86", q, 8925);

const NATURE_PROT =
  "Recipe: Nature Protection Potion (bind on pickup) - buy it before 195: Bronk at Camp Mojache, Feralas (Horde) · Logannas at Feathermoon Stronghold, Feralas (Alliance) · Glyx Brewright, Stranglethorn Vale · Alchemist Pestlezugg, Gadgetzan, Tanaris";

export const ALCHEMY: ProfessionGuide = {
  id: "alchemy",
  name: "Alchemy",
  icon: "trade_alchemy",
  kind: "crafting",
  summary:
    "For anyone who wants their own potions and elixirs, and especially casters: the route makes mana potions and Intellect elixirs you can use. Pair it with Herbalism, since nearly every step is herbs plus a vendor vial; the cheapest route is gathering them yourself. Healing potions moved to First Aid on Forever, so this route skips them.",
  trainers: [
    {
      rank: "Apprentice",
      skill: 1,
      where:
        "No level requirement on Forever. Tel'Athir, Stormwind · Vosur Brakthel, Ironforge · Milla Fairancora, Darnassus · Alchemist Mallory, Elwynn Forest · Cyndra Kindwhisper, Dolanaar (Alliance) · Whuut, Orgrimmar · Doctor Martin Felben, Undercity · Kray, Thunder Bluff · Miao'zan, Sen'jin Village · Carolai Anise, Brill (Horde) · Iaadaria Bitterwind or Valiena Swiftgale in Valanaar, Nyassa Swiftdraught in Shen'dar Village (Skyborne, Zephras Isle)",
    },
    {
      rank: "Journeyman",
      skill: 50,
      level: 10,
      where:
        "Lilyssia Nightbreeze, Stormwind · Tally Berryfizz, Ironforge · Sylvanna Forestmoon, Darnassus (Alliance) · Yelmak, Orgrimmar · Doctor Marsh, Undercity · Bena Winterhoof, Thunder Bluff (Horde)",
    },
    {
      rank: "Expert",
      skill: 125,
      level: 20,
      where: "50 silver. Ainethil, Darnassus (Alliance) · Doctor Herbert Halsey, Undercity (Horde)",
    },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Kylanna Windwhisper in Feathermoon Stronghold, on the island off western Feralas (Alliance) · Rogvar in Stonard, Swamp of Sorrows (Horde). Train before you pass 225; Expert caps there.",
    },
  ],
  steps: [
    { from: 1, to: 10, title: "Minor Arcane Elixir", icon: "inv_potion_106", id: 247754, count: 9, mats: [peacebloom(1), emptyVial(1)], note: "New on Forever, known from the start. Elixir of Minor Force (1 Silverleaf, 1 Empty Vial) works the same if Silverleaf is cheaper." },
    { from: 10, to: 55, title: "Elixir of Minor Defense", icon: "inv_potion_63", id: 5997, count: 45, mats: [silverleaf(1), peacebloom(1), emptyVial(1)], note: "Train Journeyman at 50." },
    { from: 55, to: 65, title: "Minor Mana Potion", icon: "inv_potion_70", id: 2455, count: 10, mats: [mageroyal(1), peacebloom(1), emptyVial(1)] },
    { from: 65, to: 90, title: "Elixir of Minor Fortitude", icon: "inv_potion_42", id: 2458, count: 27, mats: [earthroot(2), peacebloom(1), emptyVial(1)], note: "Turns yellow at 80." },
    { from: 90, to: 120, title: "Elixir of Wisdom", icon: "inv_potion_06", id: 3383, count: 30, mats: [mageroyal(1), briarthorn(2), emptyVial(1)], note: "Train Expert at 125." },
    { from: 120, to: 130, title: "Lesser Mana Potion", icon: "inv_potion_71", id: 3385, count: 10, mats: [mageroyal(1), stranglekelp(1), emptyVial(1)] },
    { from: 130, to: 150, title: "Fire Oil", icon: "inv_potion_38", id: 6371, count: 20, makes: 2, mats: [m("Firefin Snapper", "inv_misc_monsterhead_01", 2, 6359), emptyVial(1)], note: "Makes 2 per craft on Forever: keep 30 of the 40 for Elixir of Fire Power." },
    { from: 150, to: 165, title: "Elixir of Fire Power", icon: "inv_potion_55", id: 6373, count: 15, mats: [m("Fire Oil", "inv_potion_38", 2, 6371), kingsblood(1), leadedVial(1)], note: "The 30 Fire Oil come from the previous step." },
    { from: 165, to: 195, title: "Mana Potion", icon: "inv_potion_72", id: 3827, count: 36, mats: [stranglekelp(1), kingsblood(1), leadedVial(1)] },
    { from: 195, to: 225, title: "Nature Protection Potion", icon: "inv_potion_06", id: 6052, count: 36, mats: [liferoot(1), stranglekelp(1), leadedVial(1)], where: NATURE_PROT, note: "Train Artisan before 225." },
    { from: 225, to: 235, title: "Nature Protection Potion", icon: "inv_potion_06", id: 6052, count: 26, mats: [liferoot(1), stranglekelp(1), leadedVial(1)], note: "Green by now, so skill-ups are slow; bring a few spare herbs." },
    { from: 235, to: 265, title: "Elixir of Greater Intellect", icon: "inv_potion_10", id: 9179, count: 36, mats: [blindweed(1), khadgar(1), crystalVial(1)] },
    {
      from: 265,
      to: 300,
      title: "Elixir of Greater Defense",
      icon: "inv_potion_66",
      id: 13445,
      count: 47,
      mats: [m("Stonescale Eel", "inv_misc_fish_11", 1, 13422), leadedVial(1), sungrass(1), crystalVial(1)],
      where: "Recipe: Elixir of Superior Defense from Soolie Berryfizz, Ironforge (Alliance) · Kor'geld, Orgrimmar (Horde)",
      note: "Forever's name for Elixir of Superior Defense. Each elixir takes 2 Stonescale Oil: turn 1 Stonescale Eel + 1 Leaded Vial into 2 oil first (Alchemy 250). The mats here count the eel and vial instead of the oil.",
    },
  ],
  tips: [
    "Alternative for 265-300: 55 Superior Mana Potions (2 Sungrass, 2 Blindweed, 1 Crystal Vial each). Recipe from Ulthir, Darnassus (Alliance) · Algernon, Undercity (Horde).",
    "No Firefin Snappers? Skip Fire Oil and Elixir of Fire Power and make Lesser Mana Potions from 130 to 165 (about 42 more).",
    "Vials are sold by trade-supply and reagent vendors, including the alchemy trainers.",
  ],
};

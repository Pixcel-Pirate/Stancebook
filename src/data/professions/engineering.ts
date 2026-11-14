import type { Mat, ProfessionGuide } from "@/lib/professions";

// Per-craft reagents come from Wowhead's WoW Forever item data (item=<id>&xml createdBy), 2026-11-13.
// Skill ranges and craft counts follow wow-professions.com's Forever route; counts are estimates, since a recipe can
// stop giving points before the range ends once it turns green.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const copper = (q: number) => m("Copper Bar", "inv_ingot_02", q, 2840);
const bronze = (q: number) => m("Bronze Bar", "inv_ingot_bronze", q, 2841);
const mithril = (q: number) => m("Mithril Bar", "inv_ingot_06", q, 3860);
const thorium = (q: number) => m("Thorium Bar", "inv_ingot_07", q, 12359);
const linen = (q: number) => m("Linen Cloth", "inv_fabric_linen_01", q, 2589);
const wool = (q: number) => m("Wool Cloth", "inv_fabric_wool_01", q, 2592);
const roughBP = (q: number) => m("Rough Blasting Powder", "inv_misc_dust_01", q, 4357);
const bolts = (q: number) => m("Handful of Copper Bolts", "inv_misc_gear_06", q, 4359);
const coarseBP = (q: number) => m("Coarse Blasting Powder", "inv_misc_dust_02", q, 4364);
const bronzeTube = (q: number) => m("Bronze Tube", "inv_gizmo_pipe_01", q, 4371);
const heavyBP = (q: number) => m("Heavy Blasting Powder", "inv_misc_dust_06", q, 4377);
const gizmo = (q: number) => m("Whirring Bronze Gizmo", "inv_gizmo_02", q, 4375);
const framework = (q: number) => m("Bronze Framework", "inv_gizmo_bronzeframework_01", q, 4382);
const solidBP = (q: number) => m("Solid Blasting Powder", "inv_misc_powder_black", q, 10505);
const trigger = (q: number) => m("Unstable Trigger", "inv_battery_01", q, 10560);
const casing = (q: number) => m("Mithril Casing", "inv_gizmo_mithrilcasing_01", q, 10561);

export const ENGINEERING: ProfessionGuide = {
  id: "engineering",
  name: "Engineering",
  icon: "trade_engineering",
  kind: "crafting",
  summary:
    "Bombs, gadgets and Gnomish/Goblin toys for PvP and utility, plus a great pick for any class that wants Explosive Sheep and target dummies. Pair it with Mining: almost every step is bars or stone. The cheapest Forever route makes its own blasting powder, bolts, tubes and casings and spends them on later crafts, so keep everything the route tells you to make. Buy a Blacksmith Hammer first (Thrawn Boltar in Kharanos, or Aedi Thriceforged in Shen'dar Village on Zephras Isle; most trade-supply vendors near trainers sell one).",
  trainers: [
    {
      rank: "Apprentice",
      skill: 1,
      where:
        "No level requirement on Forever. Jemma Quikswitch (Ironforge), Sprite Jumpsprocket (Dwarven District, Stormwind), Bronk Guzzlegear (Steelgrill's Depot, Dun Morogh), Jenna Lemkenilli (Auberdine, Darkshore) · Thund (Orgrimmar), Mukdrak (Razor Hill), Graham Van Talen (Rogues' Quarter, Undercity), Twizwick Sprocketgrind (above the Venture Co. Mine, Mulgore) · Skyborne: Strange Hermit, Shadowgale Forest, Zephras Isle",
    },
    {
      rank: "Journeyman",
      skill: 50,
      level: 10,
      where:
        "Lilliam Sparkspindle (Stormwind), Trixie Quikswitch (Ironforge), Finbus Geargrind (Duskwood) · Nogg (Orgrimmar), Franklin Lloyd (Undercity)",
    },
    {
      rank: "Expert",
      skill: 125,
      level: 20,
      where: "50 silver. Springspindle Fizzlegear (Ironforge, Alliance) · Roxxik (Orgrimmar, Horde)",
    },
    {
      rank: "Artisan",
      skill: 200,
      level: 35,
      where:
        "Buzzek Bracketswing in Gadgetzan, Tanaris: standing outside the inn near the mailbox. Same trainer for both factions. Gnomish or Goblin specialization opens at 200 (level 30).",
    },
  ],
  steps: [
    { from: 1, to: 30, title: "Rough Blasting Powder", icon: "inv_misc_dust_01", id: 4357, count: 60, mats: [m("Rough Stone", "inv_stone_06", 1, 2835)], note: "Keep all 60 for the Rough Copper Bombs." },
    { from: 30, to: 50, title: "Handful of Copper Bolts", icon: "inv_misc_gear_06", id: 4359, count: 30, mats: [copper(1)], note: "Keep all 30 for the Rough Copper Bombs." },
    { from: 50, to: 51, title: "Arclight Spanner", icon: "inv_misc_wrench_01", id: 6219, count: 1, mats: [copper(6)], note: "A tool you need for later recipes. Train Journeyman first." },
    { from: 51, to: 75, title: "Rough Copper Bomb", icon: "inv_misc_bomb_09", id: 4360, count: 30, mats: [copper(1), bolts(1), roughBP(2), linen(1)] },
    { from: 75, to: 90, title: "Coarse Blasting Powder", icon: "inv_misc_dust_02", id: 4364, count: 60, mats: [m("Coarse Stone", "inv_stone_09", 1, 2836)], note: "Keep all 60 for the Coarse Dynamite." },
    { from: 90, to: 100, title: "Coarse Dynamite", icon: "inv_misc_bomb_06", id: 4365, count: 20, mats: [coarseBP(3), linen(1)] },
    { from: 100, to: 105, title: "Silver Contact", icon: "inv_ingot_04", id: 4404, count: 5, mats: [m("Silver Bar", "inv_ingot_01", 1, 2842)] },
    { from: 105, to: 125, title: "Bronze Tube", icon: "inv_gizmo_pipe_01", id: 4371, count: 25, mats: [bronze(2), m("Weak Flux", "inv_misc_ammo_gunpowder_02", 1, 2880)], where: "Weak Flux is sold by trade-supply vendors.", note: "Keep 10 for the Standard Scopes." },
    { from: 125, to: 135, title: "Standard Scope", icon: "inv_misc_spyglass_02", id: 4406, count: 10, mats: [bronzeTube(1), m("Moss Agate", "inv_misc_gem_emerald_02", 1, 1206)], note: "Train Expert first." },
    { from: 135, to: 142, title: "Heavy Blasting Powder", icon: "inv_misc_dust_06", id: 4377, count: 30, mats: [m("Heavy Stone", "inv_stone_12", 1, 2838)], note: "Keep all 30 for the Explosive Sheep." },
    { from: 142, to: 150, title: "Whirring Bronze Gizmo", icon: "inv_gizmo_02", id: 4375, count: 15, mats: [bronze(2), wool(1)], note: "Keep all 15 for the Explosive Sheep." },
    { from: 150, to: 160, title: "Bronze Framework", icon: "inv_gizmo_bronzeframework_01", id: 4382, count: 15, mats: [bronze(2), m("Medium Leather", "inv_misc_leatherscrap_05", 1, 2319), wool(1)], note: "Keep all 15 for the Explosive Sheep." },
    { from: 160, to: 175, title: "Explosive Sheep", icon: "spell_nature_polymorph", id: 4384, count: 15, mats: [heavyBP(2), gizmo(1), framework(1), wool(2)] },
    { from: 175, to: 194, title: "Solid Blasting Powder", icon: "inv_misc_powder_black", id: 10505, count: 60, mats: [m("Solid Stone", "inv_stone_10", 2, 7912)], note: "Keep all 60: 20 for Unstable Triggers, 40 for Hi-Explosive Bombs." },
    { from: 194, to: 195, title: "Gyromatic Micro-Adjustor", icon: "inv_misc_screwdriver_02", id: 10498, count: 1, mats: [m("Steel Bar", "inv_ingot_steel", 4, 3859)], note: "A tool needed for later recipes." },
    { from: 195, to: 200, title: "Mithril Tube", icon: "inv_musket_01", id: 10559, count: 6, mats: [mithril(3)], note: "Train Artisan at 200." },
    { from: 200, to: 215, title: "Unstable Trigger", icon: "inv_battery_01", id: 10560, count: 20, mats: [mithril(1), m("Mageweave Cloth", "inv_fabric_mageweave_01", 1, 4338), solidBP(1)], note: "Keep all 20 for the Hi-Explosive Bombs." },
    { from: 215, to: 238, title: "Mithril Casing", icon: "inv_gizmo_mithrilcasing_01", id: 10561, count: 40, mats: [mithril(3)], note: "Keep all 40 for the Hi-Explosive Bombs." },
    { from: 238, to: 250, title: "Hi-Explosive Bomb", icon: "inv_misc_bomb_07", id: 10562, count: 20, mats: [casing(2), trigger(1), solidBP(2)] },
    { from: 250, to: 260, title: "Dense Blasting Powder", icon: "inv_misc_ammo_gunpowder_01", id: 15992, count: 30, mats: [m("Dense Stone", "inv_misc_stonetablet_07", 2, 12365)] },
    { from: 260, to: 285, title: "Thorium Widget", icon: "inv_gizmo_04", id: 15994, count: 35, mats: [thorium(3), m("Runecloth", "inv_fabric_purplefire_01", 1, 14047)], where: "Schematic: Gearcutter Cogspinner (Ironforge) · Sovik (Orgrimmar)" },
    { from: 285, to: 300, title: "Thorium Tube", icon: "inv_gizmo_pipe_04", id: 16000, count: 20, mats: [thorium(6)], where: "Schematic: Xizzer Fizzbolt in Everlook, Winterspring (both factions; the tube is BoP)" },
  ],
  tips: [
    "Gnomes no longer get +15 Engineering on Forever; the racial now makes specialization devices fail 20% less often.",
    "Pick Goblin (bombs, Goblin Jumper Cables) or Gnomish (Net-o-Matic, Gnomish Cloaking Device) specialization at 200 from the quest givers; you can only have one.",
    "Keep a few Dense Blasting Powders, Thorium Widgets and Thorium Tubes: they go into endgame gadgets and Thorium Grenades.",
  ],
};

import type { Mat, ProfessionGuide } from "@/lib/professions";

// Recipes and icons from Wowhead Classic item data (wow-classic-items, createdBy). Craft counts follow Wowhead's WoW
// Forever First Aid leveling guide; book and quest locations from wow-professions.com's Forever guide, 2026-11-13.
const m = (name: string, icon: string, qty: number, id: number): Mat => ({ name, icon, qty, id });
const linen = (q: number) => m("Linen Cloth", "inv_fabric_linen_01", q, 2589);
const wool = (q: number) => m("Wool Cloth", "inv_fabric_wool_01", q, 2592);
const silk = (q: number) => m("Silk Cloth", "inv_fabric_silk_01", q, 4306);
const mageweave = (q: number) => m("Mageweave Cloth", "inv_fabric_mageweave_01", q, 4338);
const runecloth = (q: number) => m("Runecloth", "inv_fabric_purplefire_01", q, 14047);

const BOOK_VENDOR = "Deneb Walker in Stromgarde Keep, Arathi Highlands (Alliance) · Balai Lok'Wein in Brackenwall Village, Dustwallow Marsh (Horde)";
const DOCTOR = "Doctor Gustaf VanHowzen in Theramore Isle (Alliance) · Doctor Gregory Victor in Hammerfall, Arathi Highlands (Horde)";

export const FIRST_AID: ProfessionGuide = {
  id: "first-aid",
  name: "First Aid",
  icon: "spell_holy_sealofsacrifice",
  kind: "secondary",
  summary:
    "Bandages from the cloth you loot while leveling. It doesn't take a profession slot, so every character should have it. Save cloth from level 1.",
  trainers: [
    { rank: "Apprentice", skill: 1, where: "Any First Aid trainer, no level needed: Shaina Fuller (Stormwind), Nissa Firestone (Ironforge), Dannelor (Darnassus), Arnok (Orgrimmar), Mary Edras (Undercity), Pand Stonebinder (Thunder Bluff), or the starting-town inns" },
    { rank: "Journeyman", skill: 50, level: 10, where: "Any First Aid trainer. Also learn Wool Bandage at 80, Heavy Wool at 115 and Silk at 150 there." },
    { rank: "Expert", skill: 125, where: `Book "Expert First Aid - Under Wraps" from ${BOOK_VENDOR}. Buy Manual: Heavy Silk Bandage and Manual: Mageweave Bandage there too.` },
    { rank: "Artisan", skill: 225, level: 35, where: `Quest "Triage" from ${DOCTOR}. Save 15 patients and turn it in straight away.` },
  ],
  steps: [
    { from: 1, to: 40, title: "Linen Bandage", icon: "inv_misc_bandage_15", id: 1251, count: 41, mats: [linen(1)] },
    { from: 40, to: 80, title: "Heavy Linen Bandage", icon: "inv_misc_bandage_18", id: 2581, count: 55, mats: [linen(2)], note: "Train Journeyman at 50." },
    { from: 80, to: 115, title: "Wool Bandage", icon: "inv_misc_bandage_14", id: 3530, count: 48, mats: [wool(1)] },
    { from: 115, to: 150, title: "Heavy Wool Bandage", icon: "inv_misc_bandage_17", id: 3531, count: 48, mats: [wool(2)], note: "Buy the Expert book at 125; Journeyman stops at 150." },
    { from: 150, to: 180, title: "Silk Bandage", icon: "inv_misc_bandage_01", id: 6450, count: 41, mats: [silk(1)], where: "Last recipe the trainer teaches." },
    { from: 180, to: 210, title: "Heavy Silk Bandage", icon: "inv_misc_bandage_02", id: 6451, count: 41, mats: [silk(2)], where: `Manual from ${BOOK_VENDOR}` },
    { from: 210, to: 240, title: "Mageweave Bandage", icon: "inv_misc_bandage_19", id: 8544, count: 41, mats: [mageweave(1)], where: `Manual from ${BOOK_VENDOR}`, note: "Do Triage at 225 or you stop gaining." },
    { from: 240, to: 260, title: "Heavy Mageweave Bandage", icon: "inv_misc_bandage_20", id: 8545, count: 24, mats: [mageweave(2)], where: `Taught by ${DOCTOR}` },
    { from: 260, to: 290, title: "Runecloth Bandage", icon: "inv_misc_bandage_11", id: 14529, count: 40, mats: [runecloth(1)], where: `Taught by ${DOCTOR}` },
    { from: 290, to: 300, title: "Heavy Runecloth Bandage", icon: "inv_misc_bandage_12", id: 14530, count: 11, mats: [runecloth(2)], where: `Taught by ${DOCTOR}` },
  ],
  tips: [
    "Forever moved the healing potions from Alchemy to First Aid: Minor Healing Potion (1 Peacebloom, 1 Mild Spices, 1 Empty Vial) can replace bandages for 1-75 if you have herbs.",
    "Forever also adds curatives (Anti-Venom, Simple Poultice, Woolen Tourniquet) for poisons, diseases and bleeds.",
  ],
};

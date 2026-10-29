import type { Ability } from "./abilities";
import type { ClassId } from "./macros";

/**
 * Playable races in WoW Forever and their racials, from wowforevertalents.com/racials
 * with the Oct 16 and Oct 26 racial patches applied. Priest racial spells live in the
 * priest ability list (abilities.ts) and are looked up by name.
 */
export type Race = {
  id: string;
  name: string;
  faction: "Alliance" | "Horde";
  icon: string;
  classes: ClassId[];
  racials: Ability[];
  priestSpells: string[];
};

type R = [name: string, icon: string, meta: string, desc: string];
const race = (
  id: string,
  name: string,
  faction: Race["faction"],
  icon: string,
  classes: ClassId[],
  racials: R[],
  priestSpells: string[] = [],
): Race => ({
  id,
  name,
  faction,
  icon,
  classes,
  racials: racials.map(([name, icon, meta, desc]) => ({ name, icon, meta, desc })),
  priestSpells,
});

export const RACES: Race[] = [
  race("human", "Human", "Alliance", "race_human_male", ["warrior", "paladin", "hunter", "rogue", "priest", "mage", "warlock"], [
    ["Will to Survive", "spell_shadow_charm", "Active · 3 min cooldown · Forever", "New in Forever. Breaks every stun on you at once."],
    ["Perception", "spell_nature_sleep", "Active · 3 min cooldown", "Much better stealth detection for 20 sec."],
    ["Ruthless", "ability_rogue_eviscerate", "Passive · Forever", "New in Forever. +1% critical strike chance with spells and attacks (was 2% before Oct 26)."],
    ["The Human Spirit", "inv_enchant_shardbrilliantsmall", "Passive", "Spirit +10% since Oct 26 (was 5%)."],
  ], ["Divine Grace", "Feedback"]),
  race("dwarf", "Dwarf", "Alliance", "race_dwarf_male", ["warrior", "paladin", "hunter", "rogue", "priest", "shaman"], [
    ["Stoneform", "spell_shadow_unholystrength", "Active · 3 min cooldown", "Removes bleed, poison and disease effects and cuts physical damage taken by 10% for 8 sec. No armor bonus in Forever."],
    ["Find Treasure", "racial_dwarf_findtreasure", "Active · Tracking", "Shows nearby treasure on the minimap, and gives a chance for extra items from most chests."],
    ["Big Game Hunter", "inv_weapon_rifle_05", "Passive · Forever", "New in Forever. 5% more damage against Beasts."],
    ["Artisan's Precision", "ability_marksmanship", "Passive · Forever", "+1% chance to hit. Replaced Earth Fury (+2% critical bonus) on Oct 26."],
  ], ["Desperate Prayer", "Chastise"]),
  race("nightelf", "Night Elf", "Alliance", "race_nightelf_male", ["warrior", "hunter", "rogue", "priest", "druid"], [
    ["Elune's Light", "spell_nature_moonglow", "Active · 3 min cooldown · Forever", "New in Forever. +10% critical strike chance with spells and attacks for 15 sec."],
    ["Shadowmeld", "ability_ambush", "Active · 10 sec cooldown", "Harder to detect while still. In combat it makes enemies less likely to attack you, but the cooldown becomes 2 min."],
    ["Quickness", "ability_racial_shadowmeld", "Passive", "+1% dodge and 2% movement speed that stacks with other speed effects. Night Elf rogues and druids are harder to spot in stealth."],
    ["Wisp Spirit", "spell_nature_wispsplode", "Passive", "As a wisp after death you move 75% faster (50% in Classic)."],
  ], ["Starshards", "Elune's Grace"]),
  race("gnome", "Gnome", "Alliance", "race_gnome_male", ["warrior", "rogue", "priest", "mage", "warlock"], [
    ["Escape Artist", "ability_rogue_trip", "Active · 2 min cooldown", "Breaks movement-impairing effects and makes you immune to them for 3 sec."],
    ["Eureka!", "inv_gnometoy", "Active · 2 min cooldown · Forever", "New in Forever. For 8 sec your abilities cost 10% less and deal or heal 10% more. Works on Power Word: Shield since Oct 16."],
    ["Expansive Mind", "inv_enchant_essenceeternallarge", "Passive", "+5% maximum mana, energy or rage."],
    ["Engineering Specialization", "inv_misc_gear_01", "Passive", "Engineering devices fail and backfire 20% less often."],
  ], ["Confounding Flash", "Contingency Plan"]),
  race("skyborne-high-order", "Skyborne (High Order)", "Alliance", "spell_nature_cyclone", ["warrior", "hunter", "rogue", "druid", "mage"], [
    ["Walk on Air", "spell_magic_featherfall", "Active · 90 sec cooldown · Forever", "Glide down with full control for up to 10 sec. Not flight. 90 sec cooldown since Oct 16."],
    ["Read Ley Line", "spell_arcane_arcane04", "Active · 2 sec cast · 2 min cooldown · Forever", "Doubles health and mana regeneration for at least 30 sec, or up to 15 min on a ley line. Castable while moving since Oct 16."],
    ["Wind Blessed", "spell_nature_windfury", "Passive · Forever", "+3% melee, ranged and spell haste (raised from 1% on Oct 16)."],
    ["Elemental Insight", "spell_nature_elementalshields", "Passive · Forever", "5% more damage against Elementals."],
  ]),
  race("orc", "Orc", "Horde", "race_orc_male", ["warrior", "hunter", "rogue", "shaman", "mage", "warlock"], [
    ["Blood Fury", "racial_orc_berserkerstrength", "Active · 2 min cooldown", "+10% attack power and spell power for 15 sec. 2 min cooldown since Oct 26, so it lines up with other 2 min cooldowns."],
    ["Shatter Curse", "spell_nature_removecurse", "Active · 3 min cooldown · Forever", "New in Forever. Removes your curses and banes and cuts magic damage taken by 5% for 8 sec."],
    ["Hardiness", "inv_helmet_23", "Passive", "Stuns on you last 20% shorter."],
    ["Command", "ability_warrior_warcry", "Passive", "Your pets deal 5% more damage. Back on Oct 26, replacing Savage."],
  ]),
  race("undead", "Undead", "Horde", "race_scourge_male", ["warrior", "paladin", "rogue", "priest", "mage", "warlock"], [
    ["Will of the Forsaken", "spell_shadow_raisedead", "Active · 2 min cooldown", "Breaks Charm, Fear and Sleep. Not usable under Scatter Shot."],
    ["Cannibalize", "ability_racial_cannibalize", "Active · 2 min cooldown", "Eat a nearby corpse to restore 7% health and mana every 2 sec for 10 sec. Restores mana too in Forever."],
    ["Touch of the Grave", "spell_shadow_fingerofdeath", "Passive · Forever", "New in Forever. Your attacks can drain health from the target, up to 5% of your maximum. Can proc every 15 sec since Oct 26."],
    ["Underwater Breathing", "spell_shadow_demonbreath", "Passive", "You can stay underwater 300% longer."],
  ], ["Touch of Weakness", "Dark Sacrifice"]),
  race("tauren", "Tauren", "Horde", "race_tauren_male", ["warrior", "hunter", "shaman", "druid"], [
    ["War Stomp", "ability_warstomp", "Active · 90 sec cooldown", "Stuns up to 5 enemies within 8 yd for 2 sec."],
    ["Cultivation", "inv_misc_flower_01", "Active · 15 min cooldown", "Grow a copy of a nearby herb you can pick without Herbalism. 15 min cooldown since Oct 16."],
    ["Endurance", "spell_nature_unyeildingstamina", "Passive", "Maximum health +5% again since Oct 26."],
    ["Plainsrunning", "achievement_zone_barrens_01", "Passive · Forever", "New in Forever. Build up to 30% movement speed while you keep running, plus 3% mounted speed."],
  ]),
  race("troll", "Troll", "Horde", "race_troll_male", ["warrior", "hunter", "rogue", "priest", "shaman", "mage", "warlock"], [
    ["Berserking", "racial_troll_berserk", "Active · 3 min cooldown", "10–30% faster casting and attacks, more the lower your health. Lasts 15 sec since Oct 26 (was 10)."],
    ["Rapid Regeneration", "ability_racial_regeneratin", "Active · 3 min cooldown · Forever", "New in Forever. Regenerate 50% of your health over 6 sec. Moving, acting or taking damage cancels it."],
    ["Regeneration", "spell_nature_regenerate", "Passive", "Health regeneration +20%, and 20% of it keeps going in combat."],
    ["Beast Slaying", "inv_misc_pelt_bear_ruin_02", "Passive", "5% more damage against Beasts."],
  ], ["Hex of Weakness", "Shadowguard"]),
  race("skyborne-windshaper", "Skyborne (Windshaper)", "Horde", "spell_nature_cyclone", ["warrior", "hunter", "rogue", "druid", "shaman"], [
    ["Walk on Air", "spell_magic_featherfall", "Active · 90 sec cooldown · Forever", "Glide down with full control for up to 10 sec. Not flight. 90 sec cooldown since Oct 16."],
    ["Skysight", "spell_nature_farsight", "Active · 0.5 sec cast · 2 min cooldown · Forever", "+10% run and mounted speed for at least 30 sec, or up to 15 min near an elemental convergence. Castable while moving since Oct 16."],
    ["Wind Blessed", "spell_nature_windfury", "Passive · Forever", "+3% melee, ranged and spell haste (raised from 1% on Oct 16)."],
    ["Elemental Insight", "spell_nature_elementalshields", "Passive · Forever", "5% more damage against Elementals."],
  ]),
];

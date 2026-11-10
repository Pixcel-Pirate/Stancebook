import type { ClassId } from "./macros";

/**
 * Every WoW Forever class change, simplified, one line each, newest patch first.
 * Official: Blizzard's "WoW Forever Beta Development Notes" forum thread (US post dates),
 * cross-checked with kami-labs.fr, warcrafttavern.com and pcgames.de.
 * Datamined (no Blizzard notes): wowforevertalents.com/patch-notes and playfulls.com/patch-notes.
 * Add a new patch at the top of PATCHES and give each changed class an entry
 * (a class left out shows "No changes for your class").
 */
export type Patch = { id: string; label: string; date?: string; official: boolean; summary: string };

export const PATCHES: Patch[] = [
  { id: "nov10", label: "Nov 10 tuning", date: "2026-11-10", official: true, summary: "First live tuning pass: tanking pets, Affliction DoTs next to Wrack, and Enhancement back on Strength." },
  { id: "nov6", label: "Nov 6 hotfixes", date: "2026-11-06", official: true, summary: "Bug fixes: Voidwalker health, Soul Siphon and Wrack, Druid Bloom, Mage Arcane Blast." },
  { id: "nov4", label: "Nov 3-4 hotfixes", date: "2026-11-04", official: false, summary: "Launch-day server changes: Fury talent swap, tank stance threat, Shaman Totemic Call and Riptide." },
  { id: "nov2", label: "Nov 2 patch", date: "2026-11-02", official: true, summary: "Launch notes: confirms the Oct 30-31 changes, plus Rogue Shank, Feral and Hunter damage, and racial fixes." },
  { id: "oct31", label: "Oct 31 hotfix", date: "2026-10-31", official: false, summary: "Server hotfix with big Paladin and Druid talent changes." },
  { id: "oct30", label: "Oct 30 patch", date: "2026-10-30", official: false, summary: "Last client build before launch: Mage and Hunter tuning." },
  { id: "oct26", label: "Oct 26 patch", date: "2026-10-26", official: true, summary: "Racials only (with an Oct 27 addendum). No class changes." },
  { id: "oct23", label: "Oct 23 build", date: "2026-10-23", official: false, summary: "Frost Mage talents and a few small fixes." },
  { id: "oct18", label: "Oct 18 build", date: "2026-10-18", official: false, summary: "A handful of small tuning changes." },
  { id: "oct15", label: "Oct 15 patch", date: "2026-10-15", official: true, summary: "Raid-wide buffs, race rework, big talent pass." },
  { id: "oct8", label: "Oct 8 patch", date: "2026-10-08", official: true, summary: "Tank rage fixes and early spell ranks retuned." },
  { id: "oct1", label: "Oct 1 patch", date: "2026-10-01", official: true, summary: "Level 30 update: crit rage, Fury and Feral talent rework." },
  { id: "sept24", label: "Sept 24 patch", date: "2026-09-24", official: true, summary: "First beta tuning pass for all nine classes." },
  { id: "launch", label: "Forever vs Classic", official: true, summary: "What Forever changed from original Classic before the first patch." },
];

type ClassNotes = Partial<Record<string, string[]>>;

const WANDS = "Wands need you to stand still for 0.5 seconds before they shoot.";

export const PATCH_NOTES: Record<ClassId, ClassNotes> = {
  warrior: {
    nov6: [
      "Reckless Swings' tooltip now says it triggers Gore Drinker.",
    ],
    nov4: [
      "Fury: Raging Blows is removed. New Reckless Swings (row 4): your next 4 swings give 5 extra rage.",
      "Fury: new Improved Whirlwind (row 6) cuts Whirlwind's cooldown by up to 2 seconds and adds up to 30% damage.",
      "Fury: Flurry is 3 ranks (up to 30% speed). Gore Drinker moved to row 5 and needs Blood Craze. Enrage moved to row 3.",
      "Fury: Bloodthirst now needs a point in Death Wish.",
      "Slam's cooldown is 15 seconds (was 18).",
      "Defensive Stance gives 80% more threat (was 30%). Defiance is 7 to 20% (was 5 to 15%).",
    ],
    nov2: [
      "Improved Hamstring and Counterattack roots now share diminishing returns.",
      "Training every ability from 1 to 60 costs about 207 gold. New spells no longer go on your action bars by themselves.",
    ],
    oct30: [
      "Revenge and Victory Rush now scale with Attack Power.",
      "Improved Hamstring's root shares diminishing returns with mage and hunter roots.",
    ],
    oct15: [
      "Battle Shout now reaches the whole raid.",
      "Slam is no longer delayed when you get hit while casting it.",
      "Overpower works against much lower-level enemies.",
      "Fury: Lingering Rage no longer stops health regen after combat.",
      "Fury: Improved Berserker Rage also removes slows and roots.",
      "Arms: Weaponmaster no longer procs Sword Specialization from Shield Bash or Shield Slam.",
    ],
    oct8: [
      "Rage from getting hit no longer drops as your Stamina rises.",
      "Incoming crits and crushing blows give full rage. Absorbs are ignored.",
      "Rage is now tuned for 20-40% armor (was 50%), so tanks get more.",
      "Demoralizing Shout makes threat on every enemy it hits.",
      "Protection: Last Stand gives the right amount of health.",
      "Arms: Deep Wounds is required again to reach Impale, and no longer scales with off-hand.",
    ],
    oct1: [
      "Crits with basic attacks give 100% more rage.",
      "Rend and Sunder Armor tag the enemy to you right away.",
      "Arms: Spearing Strike no longer needs a two-hander, but needs Battle Stance.",
      "Fury: Bloodthirst scales with 45% of Attack Power (was 35%).",
      "Fury: Flurry now needs Death Wish instead of Enrage.",
      "Fury: Berserker Rage is learned at level 30 (was 32).",
      "Fury: new talents Lingering Rage (slower rage decay), Furious Precision (off-hand hit) and Gore Drinker (heal on hit).",
      "Fury: Booming Voice makes shouts bigger and cheaper. Raging Blows makes Cleave and Whirlwind cost 3 less rage.",
      "Fury: Improved Cleave and Boundless Rage were removed. Dual Wield Specialization no longer adds off-hand rage.",
      "Protection: early rows reshuffled and Toughness removed.",
    ],
    sept24: [
      "Sunder Armor threat fixed on all ranks, plus a little from Attack Power.",
      "Arms: Slam cooldown is 18 seconds (was 15). Improved Slam cuts 1.5 or 3 seconds.",
      "Arms: Bloodthrill procs twice as often (4-20%), but only from main-hand attacks.",
      "Protection: Bastion and Focused Rage swapped rows.",
    ],
    launch: [
      "Rage is normalized, so high armor no longer starves tanks and Power Word: Shield no longer blocks rage.",
      "Victory Rush (level 20): instant heal-strike after a kill.",
      "Tactical Mastery is trained at 14: keep 10 rage when you swap stances.",
      "Thunder Clap works in Defensive Stance. Vanguard lets Protection charge in Defensive.",
      "Protection gets rage from blocks, dodges and parries.",
      "Arms: Slam is a cooldown that doesn't reset your swing. Weapon talents merged.",
      "Fury: talents that grow your rage pool and improve multi-target hits.",
    ],
  },
  paladin: {
    nov4: [
      "Protection: Holy Shield is 3 ranks. The top rank hits harder and has 4 charges.",
    ],
    nov2: [
      "Righteous Fury is learned at level 10, adds 33% threat and 90% more threat from Holy damage.",
      "Salvation, Mass Salvation, Revoke and Blessing of Light are removed.",
      "Judgement of Fury taunts for 3 seconds (was 4).",
      "Protection: Reckoning gives one attack per stack. Templar's Bulwark moved to row 3. Iron Creed is 3 ranks.",
      "Retribution: Vengeance stacks to 5 and needs Seal of Command. Vindication no longer adds Attack Power. Unsealed Wrath needs Repentance.",
      "Holy: Improved Seals is 5 ranks. Voice of Truth is removed.",
    ],
    oct31: [
      "Righteous Fury adds 33% threat. Seal of Fury taunts for 3 seconds (was 4). Holy Shield is retuned to 4 ranks.",
      "Salvation, Mass Salvation, Revoke and Blessing of Light were pulled from the spell data.",
      "Holy: Holy Power now adds 50% critical healing. New talents Oath of Light and Boundless Light (Holy Shock crit). Light's Vigil is friendly-only.",
      "Holy: Spiritual Focus is 5 ranks, Reverence 2, Divine Precision gives 8% Holy hit (was 18%).",
      "Protection: Redoubt is 30% block. Improved Righteous Fury is 9% damage reduction. New Stoicism and Shieldsworn. Improved Seal of Fury and One-Handed Weapon Specialization removed.",
      "Protection: Swift Judgement judges your Seal without using it, on its own cooldown. Sacred Duty shortens Forbearance by 10 seconds.",
      "Retribution: Conviction gives 6% crit to all attacks and spells. Two-Handed Weapon Specialization adds 6% damage and 20% less threat.",
      "Retribution: Champion of the Light is 5 ranks and speeds Hammer of Wrath. Twist of Light is now Unsealed Wrath. Turn Evil replaces Instrument of Law.",
    ],
    oct30: [
      "Righteous Fury is learned at level 10 (was 16).",
    ],
    oct18: [
      "Champion of the Light gives 60% of Intellect as spell damage at rank 3 (was 30%).",
    ],
    oct15: [
      "Blessing of Salvation is now Salvation and Mass Salvation. Still -30% threat, but no longer a blessing.",
      "New spell Revoke removes Salvation from one player (for tanks).",
      "Righteous Fury Holy threat is 90% again (was 60%).",
      "Protection: Reckoning stores up to 4 extra attacks for your next swing.",
      "Seal of Righteousness and Consecration scale less with spell power.",
      "Champion of the Light gives 10/20/30% of Intellect as spell damage (was 20/40/60%).",
      "Shield Specialization restores 4% mana (was 6%). Vindication's attack power cut is much smaller.",
      "Infusion of Light no longer adds 50% Holy Shock damage.",
      "Seal of Fury is no longer overwritten by Power Word: Shield.",
    ],
    oct8: [
      "Retribution Aura is about a third weaker and uses only 6% of your spell power.",
      "Retribution Aura uses the paladin's spell power, not the ally's.",
      "Seal of Fury no longer restores mana unless you have Improved Seal of Fury.",
      "Protection: mana from Seal of Fury talents no longer makes threat.",
      "Protection: Reckoning can only proc once every 1.5 seconds.",
    ],
    oct1: [
      "Protection: Holy Shield blocks 30% (was 20%).",
      "Protection: Redoubt is 4-20% block (was 6-30%).",
      "Retribution: Champion of the Light is 20/40/60% of Intellect (was 33/66/100%).",
    ],
    sept24: [
      "Holy Strike hits harder every rank (25% up to 50% weapon damage) and is a 10-second cooldown (was 12).",
      "Improved Holy Strike is now baseline. Holy Power adds 15% crit to Holy Strike.",
      "Retribution Aura scales with your spell power.",
      "Righteous Fury Holy threat lowered to 60% (was 90%).",
      "Retribution: Vengeance caps at 3 stacks (was 5) and only procs from direct crits.",
      "Retribution: Two-Handed Weapon Specialization is 2/4/6% (was 3/6/9%).",
      "Retribution: Sacred Arbiter adds 20% Holy Strike damage (was 10%). Twist of Light makes Seals 20% cheaper.",
      "Fixes for Echo of Justice, Consecration and the Flash of Light animation.",
    ],
    launch: [
      "Judgement no longer uses up your Seal.",
      "Blessings last much longer and Blessing of Kings is baseline.",
      "Consecration is trained, not a Holy talent.",
      "Holy Strike: a new melee strike with a cooldown.",
      "Protection: Seal of Fury taunts when judged, plus better mana and block tools.",
      "Holy: Light's Vigil for group healing.",
      "Undead can be paladins (Horde).",
    ],
  },
  hunter: {
    nov10: [
      "Pets you use as tanks get stats closer to Classic Era. Blizzard gave no numbers.",
    ],
    nov2: [
      "Aimed Shot bonus damage is roughly doubled. Arcane Shot hits about 30% harder, Serpent Sting about 20%.",
      "All traps share a 30-second cooldown.",
      "Only one Hunter's Mark per target. Rank 4 gives 143 ranged Attack Power.",
      "Aspect of the Hawk gives more ranged Attack Power.",
      "Pets keep their natural attack speed when untrained.",
      "Marksmanship: Barrage is 5/10/15%, Sniper Shot bonus damage doubled, Trueshot Aura gives up to 100 ranged Attack Power.",
      "Survival: Lightning Reflexes is 3 to 15% Agility.",
    ],
    oct31: [
      "Beast Mastery: Pathfinding moved to row 3.",
    ],
    oct30: [
      "Aspect of the Hawk gives much less ranged Attack Power (47 at max rank, was 90).",
      "Trueshot Aura bonus halved (talent 15, was 30).",
      "Scare Beast is a 30-second cooldown.",
      "Entrapment, Counterattack and Improved Wing Clip roots share diminishing returns with other roots.",
    ],
    oct23: [
      "Hunter's Mark rank 4 roughly doubles its ranged Attack Power bonus (143, was 71).",
    ],
    oct15: [
      "Auto Shot needs you to stand still for 0.5 seconds before it fires.",
      "Trueshot Aura reaches the whole raid.",
      "Fire Trap scales with Attack Power. You can have one Fire and one Ice Trap out at once.",
      "Multi-Shot is reported to be instant (was a 0.5 second cast); Blizzard's notes don't list it.",
      "Strider Kick works while disarmed or with no main-hand weapon.",
      "Resourcefulness procs 50/100% and now from ability crits, not traps.",
      "Pets use Expertise and the higher of your melee or ranged crit.",
      "Pet skills nerfed: Crocolisk Dismember, Bat Sonic Blast and Bird of Prey Mine! are weaker with longer cooldowns.",
    ],
    oct8: [
      "Disengage drops twice as much threat.",
      "Beast Mastery: Unleashed Fury really raises pet damage now.",
      "Survival: Expose Prey lasts 10 seconds (was 5).",
      "Survival: Entrapment has diminishing returns and only procs when Frost Trap first goes off.",
      "Improved Wing Clip and Improved Concussive Shot have the right proc chance.",
      "Pets no longer keep healing themselves when low (bug fix).",
    ],
    oct1: [
      "Aggressive Mode is back on the pet bar.",
      "Marksmanship: Sniper Shot has 45-yard range and adds 10 yards to your next 3 shots for 10 seconds.",
      "Survival: Deflection gives 1-5% parry (was 2-10%).",
    ],
    sept24: [
      "Furious Howl gives 40% less Attack Power.",
      "Bats can learn Sonic Blast.",
      "You can't tame beasts above your level.",
      "Marksmanship: skipping Lone Wolf no longer costs 4% damage with a pet out.",
      "Survival: Lacerating Strikes can crit. Strider Kick gives 30% speed for 3 seconds.",
    ],
    launch: [
      "Pets scale with your own stats.",
      "Traps work in combat (still placed at your feet). The dead zone is still there.",
      "Aimed Shot is trained, not a talent. Pets can Assist.",
      "Beast Mastery: Summon Hawk.",
      "Marksmanship: Lone Wolf for playing without a pet.",
      "Survival is a melee and traps spec with weapon strikes.",
    ],
  },
  rogue: {
    nov6: [
      "Shank's tooltip shows its ranks, and the combo points from Boot Knife now display correctly.",
    ],
    nov4: [
      "Improved Eviscerate is now Coup de Grace (also boosts Death Mark). Improved Sinister Strike is now Efficient Strikes.",
      "Assassination: new Venom makes Shank boost your poisons for 6 seconds. Mutilate now needs Venom.",
      "Assassination: Relentless Strikes is 5 ranks, up to 20% per combo point to get 25 energy back.",
      "Subtlety: new Quick Getaway (Sap hits one more target) and Boot Knife (Shank can add 2 combo points).",
    ],
    nov2: [
      "New Shank (level 24): 5 energy, 10-second cooldown, an off-hand stab that gives back 15 energy.",
      "New Poised (level 18): your next energy ability costs 10 less.",
      "Deadly and Instant Poison scale twice as hard with Attack Power.",
      "Slice and Dice no longer makes a sitting target stand up.",
      "Assassination: Murder removed, Lethality 2 ranks, Seal Fate 3 ranks, new Blood Splatter. Mutilate does 90% weapon damage.",
      "Combat: new Composure and Flash of Steel. Aggression is 5/10/15%.",
      "Subtlety: Cutthroat, Thousand Cuts, Quietus and Improved Distract removed. Ghostly Strike lets you Ambush or Garrote without stealth for 7 seconds. New Death Mark capstone.",
    ],
    oct15: [
      "Poisons no longer proc on enemies that are hitting you.",
      "Sap no longer triggers weapon procs.",
      "Switching spec no longer refills Energy.",
      "Assassination: Cold Blood is used up when Mutilate crits.",
    ],
    oct1: [
      "A missed Expose Armor no longer wipes your combo points.",
      "Subtlety: Setup only gives combo points on the target you dodged or resisted.",
    ],
    sept24: ["Sapping a PvP-flagged target flags you for PvP."],
    launch: [
      "Energy refills smoothly instead of in ticks.",
      "Poisons scale with Attack Power and stack with Windfury and sharpening stones.",
      "Assassination: Mutilate is the main builder, plus new poison talents.",
      "Combat: weapon talents cleaned up, better resource flow.",
      "Subtlety: Quietus and Thousand Cuts for PvE. Cutthroat and Dirty Tricks join the kit.",
    ],
  },
  priest: {
    nov2: [
      "Power Word: Shield can be replaced by an equal or higher rank.",
      "Shadow Word: Death no longer hurts you on a miss.",
      "Dark Sacrifice no longer breaks crowd control.",
      "Shadow: Vampiric Embrace healing can't crit. Devouring Contagion no longer spreads from critters.",
    ],
    oct31: [
      "Binding Heal is replaced by Holy Binding: you heal yourself for 50% of what Flash Heal heals others.",
      "Shadow Word: Death backlash is 30% of your max health if the target lives (was 10%).",
      "Cure Disease and Abolish Disease work in Shadowform.",
    ],
    oct18: [
      "Holy Fire rank 1 hits slightly softer (52-66, was 56-70).",
    ],
    oct15: [
      WANDS,
      "Devouring Plague cooldown is 24 seconds (was 1 minute).",
      "Vampiric Embrace cooldown is 30 seconds (was 1 minute) and can't be resisted.",
      "Shadow Word: Death cooldown is 18 seconds.",
      "Shadow: new talent Dark Inspiration gives your party Spirit after Mind Blast or a full Mind Flay.",
      "Shadow: Improved Fade and Shadow Affinity removed. Improved Mind Blast moved to row 2.",
      "Discipline: Mental Strength moved to row 2 (2-10% Intellect). Improved Power Word: Shield moved to row 3.",
      "Power in Light also boosts Smite and Penance on targets with Holy Fire or Shadow Word: Pain.",
      "Twin Disciplines now covers Shadow Word: Death, Mind Flay, Starshards and Penance.",
      "Devouring Contagion spreads to 2 targets.",
    ],
    oct8: [
      "Discipline: Penance rank 1 hits and heals for less and costs 50% more mana. Ranks 2 and 4 heal more.",
      "Penance is a true 2-second channel.",
      "Smite ranks 1-4, Lesser Heal ranks 1-3 (about 15% stronger) and Heal ranks 1-2 (about 8% weaker) retuned.",
    ],
    oct1: [
      "Devouring Plague can crit.",
      "Shadow Word: Death's Early Demise bonus works at any target health (bug fix).",
      "Discipline: Inner Focus no longer boosts crits on DoTs and HoTs.",
      "Shadow: Shadow Weaving can't fail to apply.",
    ],
    sept24: [
      "Renew can crit.",
      "Power Word: Shield can replace an existing shield on a target without Weakened Soul.",
      "Racial spell fixes for Gnome, Night Elf and Undead priests.",
    ],
    launch: [
      "Every priest gets Fear Ward and Devouring Plague.",
      "Divine Spirit and Shadow Word: Death are trained.",
      "Discipline: Penance (heal or damage) and Divine Aegis.",
      "Holy: Binding Heal and Prayer of Mending.",
      "Shadow: reworked Shadowform with workable mana, less reliance on raid debuffs.",
      "Gnomes can be priests.",
    ],
  },
  shaman: {
    nov10: [
      "Enhancement: Strength is the best stat again. Collect Strength and Attack Power gear.",
    ],
    nov4: [
      "Totemic Call replaces Totemic Projection: it pulls your totems to where you stand, 30 second cooldown.",
      "Restoration: Riptide no longer heals up front. It is a 15 second HoT on a 12 second cooldown.",
      "Chain Lightning has a 2.5 second cast. Lightning Bolt and Earth Shock hit harder.",
    ],
    nov2: [
      "Lava Burst is removed. Call of Thunder (+5% Lightning crit) is back in its row, and Elemental Mastery is now Lightning Mastery.",
      "Improved Ghost Wolf moved to row 4.",
      "Training every ability from 1 to 60 costs about 207 gold.",
    ],
    oct30: [
      "Lava Burst rank 3's bonus against Flame Shocked targets no longer scales with level.",
    ],
    oct23: [
      "Lava Burst rank 3's bonus against Flame Shocked targets is back to 20% (Oct 15 had raised it to 54%).",
    ],
    oct15: [
      "Grace of Air, Strength of Earth, Windfury and Flametongue Totems reach the whole raid.",
      "Grace of Air now works alongside Windfury or Flametongue Totem.",
      "Chain Lightning costs about 35% less mana.",
      "Fire Nova costs much less mana but hits much softer.",
      "Elemental: Elemental Mastery is the new 31-point talent (faster Lightning Bolt and Lava Burst, no Chain Lightning cooldown for 15 seconds).",
      "Elemental: Lava Burst moved to row 5 (21 points). Call of Thunder removed.",
      "Elemental: Elemental Reach also cuts Totemic Projection's cooldown. Call of Flame lengthens Flame Shock.",
      "Lightning Overload no longer eats Clearcasting.",
      "Enhancement: Stormstrike costs 8% base mana, and only your own spell uses up its debuff.",
      "Mana Tide Totem gets an extra rank at 38. Water Shield procs from any spell crit.",
      "Trial by Fire (was Improved Fire Nova) makes Magma Totem last 10 seconds longer.",
    ],
    oct8: [
      "Fire Nova no longer triggers and eats Elemental Focus.",
      "Lightning Bolt ranks 1-5 hit harder.",
      "Flametongue Totem uses the attack speed of shapeshifted allies.",
      "Water Shield's tooltip shows the mana it gives. Mana Tide pulses are visible again.",
    ],
    oct1: [
      "Totemic Recall gives mana back.",
      "Disease Cleansing Totem lasts 5 minutes (fix).",
      "Ghost Wolf is easier to see in bright areas.",
    ],
    sept24: [
      "Lightning Bolt ranks 3 and 4 hit harder.",
      "Flametongue Totem has no duration, is replaced instantly, and doesn't stack with Flametongue Weapon or Windfury Totem.",
      "Tranquil Air, Windfury and Grace of Air Totems don't stack between shaman in a group.",
      "Elemental: Lava Burst ranks 1-2 hit about 10% harder than a matching Lightning Bolt. Elemental Fury and Elemental Alacrity swapped rows.",
      "Enhancement: Rage of the Farseer no longer adds cast speed.",
      "Restoration: Riptide can crit.",
    ],
    launch: [
      "Totems can be saved and dropped as a set (Call of the Elements), moved, and recalled.",
      "Fire Nova is a spell, not a totem.",
      "Elemental: Lightning Overload and Lava Burst.",
      "Enhancement: two-handed spellblade built around Maelstrom Weapon.",
      "Restoration: Riptide and better mana tools.",
      "Dwarves (Alliance) and Windshaper Skyborne (Horde) can be shaman.",
    ],
  },
  mage: {
    nov6: [
      "Arcane Blast's buff lasts 18 seconds as intended.",
      "The Research spell no longer flickers after a relog. You get Study after the quest.",
    ],
    nov2: [
      "Frost Blast is removed.",
      "Arcane: Missile Barrage is used up when Arcane Missiles starts. Clearcasting isn't spent while Missile Barrage is active.",
      "Fire: Ignite also covers Flamestrike. Improved Fire Blast moved to row 3.",
      "Frost: Frost Warding can fully negate a spell instead of reflecting it. Elemental Precision is now Precision.",
    ],
    oct31: [
      "Arcane Blast gives 12% of Intellect per stack (was 15%), stacks last 18 seconds, and the mana cost rises 100% per stack.",
      "Ice Lance does 300% to frozen targets again (was 200%).",
      "Arcane Resilience is 3 ranks and gives more armor.",
      "Frost: Ice Barrier adds 15% Frost damage for 1 minute. Winter's Chill adds 20% Cone of Cold damage per stack. Arctic Reach covers Ice Lance.",
    ],
    oct30: [
      "Ice Lance has an 8-second cooldown.",
      "Frost Blast can no longer be trained.",
      "Arcane: Arcane Focus removed. Arcane Resilience and Missile Barrage swapped places.",
      "Fire: Improved Fireball is now Accelerant (also speeds Arcane Wrath). Incineration is 5 ranks for 10% crit, Critical Mass 3 ranks for 6%.",
      "Elemental Precision is now Precision and covers all spells.",
    ],
    oct23: [
      "Frost: Piercing Ice removed. Frost Channeling and Improved Blizzard moved.",
      "Elemental Precision is 3 ranks for 6% hit (was 5 ranks).",
      "Frost Warding gives Frost Ward a 20% chance to negate spells and adds 20% to Ice Barrier and Frost Ward absorbs.",
      "Ice Barrier and Frost Ward absorbs scale with 10% of Frost spell power. Ice Barrier adds 3% Frost damage.",
    ],
    oct18: [
      "Frost Blast can now trigger Missile Barrage.",
    ],
    oct15: [
      WANDS,
      "New spell Frost Blast (level 24): 1.5 second cast, 40% slow. Replaces Frostbolt rank 1.",
      "Arcane Blast redesigned: each cast gives 15% of Intellect as spell damage, stacking 4 times for 15 seconds. Its own damage is 40% lower.",
      "Arcane: new 16-point talent Arcane Wrath. Missile Barrage moved to row 1 (2 points).",
      "Fire: Fire Power is 3 points and grows with each Fire effect (up to 12%). Critical Mass is 5 points for 10% crit.",
      "Fire: Wake of Fire is back to Improved Fire Blast (more Fire Blast range, no kill bonus).",
      "Frost: Winter's Chill no longer gives crit. Each stack adds 40% to Cone of Cold, up to 5.",
      "Frost: Cone of Cold slows 10% more and 3 seconds longer. Ice Lance does 200% to frozen targets (was 300%).",
      "Clearcasting no longer procs from Dampen or Amplify Magic or out of combat. Frost Channeling lowers threat properly.",
    ],
    oct8: [
      "Frostbolt, Fireball (ranks 1-5) and Arcane Missiles (ranks 1-3) hit a bit harder.",
      "Fire: Impact no longer procs from Flamestrike's burn.",
    ],
    oct1: [
      "Fire: Hot Streak is renamed Heating Up.",
      "Fire: Combustion is back to 3 charges (was 4).",
      "Fire: Improved Scorch no longer rolls a second resist.",
      "Frost: Winter's Chill can't be resisted.",
      "Comprehension scrolls retuned and can't be cast while moving.",
    ],
    sept24: [
      "Arcane Missiles checks line of sight once, when the channel starts.",
      "Fire: Hot Streak lasts 20 seconds (was 15). Wake of Fire lasts 30 seconds (was 20).",
      "Fire: Ignite no longer double-counts damage bonuses.",
    ],
    launch: [
      "Frostfire Bolt is trained at 40.",
      "Arcane: Arcane Blast and Missile Barrage make it a real spec.",
      "Fire: a Hot Streak style crit chain into Pyroblast.",
      "Frost: Ice Lance and Fingers of Frost for shatter windows.",
      "Orcs can be mages.",
    ],
  },
  warlock: {
    nov10: [
      "Voidwalker gets tank stats closer to Classic Era. Blizzard gave no numbers.",
      "Affliction: Corruption, Siphon Life and Bane of Agony are retuned so they are worth casting next to Wrack. Total damage stays the same.",
    ],
    nov6: [
      "Voidwalker has about 40 more health at every level.",
      "Soul Siphon no longer makes Wrack boost its own damage.",
      "Orc Command no longer over-boosts some pet abilities.",
    ],
    nov4: [
      "Wrack deals 86 damage per tick (was 36).",
      "Destruction: Shadow and Flame is 4 to 20% (was 2 to 10%).",
    ],
    nov2: [
      "Training costs are lower to make up for Grimoires.",
    ],
    oct31: [
      "Improved Drains boosts Drain Life, Drain Soul and Drain Mana by 20% (no longer Wrack).",
    ],
    oct18: [
      "Amplify Curse now makes Curse of Exhaustion 20% stronger.",
    ],
    oct15: [
      WANDS,
      "Shadow Mastery gives 2-10% Shadow damage (was 1-5%).",
      "Affliction: Malediction is replaced by Grim Reach (+10/20% Affliction range).",
      "Destructive Reach only adds Destruction range now.",
      "Curse of Recklessness can't stack from several warlocks.",
      "Summon Incubus needs a Soul Shard with the Reagent Economy perk.",
    ],
    oct8: [
      "Your old demon is stunned while you summon a new one.",
      "Shadow Bolt ranks 1-4 hit slightly harder.",
      "Demonology: Demonic Brand only makes high threat with Shadow damage.",
    ],
    oct1: [
      "Hellfire can crit.",
      "Drain Soul stops when you start casting something else.",
      "Affliction: Soul Harvesting is renamed Soul Harvest and gives its mana regen properly.",
      "Aggressive Mode is back on the pet bar.",
    ],
    sept24: [
      "Voidwalker Sacrifice scales with 10% of your spell healing.",
      "Life Tap's tooltip is fixed (it scales only with Spirit).",
    ],
    launch: [
      "DoTs can crit.",
      "Agony and Doom are Banes, separate from utility Curses, so you can run one of each.",
      "Pets scale with your stats. The Succubus line is now the Sayaad.",
      "Affliction: Wrack, a drain-style filler.",
      "Demonology: Demonic Pact keeps your demon out while using Demonic Sacrifice.",
      "Destruction: Incinerate filler and Bane of Havoc.",
      "Trolls can be warlocks.",
    ],
  },
  druid: {
    nov6: [
      "Restoration: Bloom now heals its target.",
      "Shadowmelded Night Elf Druids no longer get Ravage and Pounce.",
      "Bear Form, Ravage and Swiftmend tooltips fixed. Their real effects did not change.",
    ],
    nov4: [
      "Feral: Rend and Tear is 3 to 15% (was 2 to 10%).",
    ],
    nov2: [
      "Shred does 200% weapon damage, Claw 140%, Ravage 435%.",
      "Rip, Rake, Ferocious Bite and Pounce do about 25% more damage.",
      "Bear and Dire Bear Form threat is +115% (was +50%).",
      "New Poised (level 32): your next energy ability costs 10 less.",
      "Lacerate is now a Feral talent. Ferocious Bite has a new rank 1 at level 24.",
      "Starfire hits about 40% harder.",
      "Restoration: Swiftmend only uses your own HoTs. Reflection and Subtlety swapped rows.",
    ],
    oct31: [
      "Feral: Berserk removed. Primal Bite moved to row 7 (needs Leader of the Pack), now 2 ranks learned at 50 and 60.",
      "Feral: Lacerate is a stacking bleed (up to 5) that also adds weapon damage per stack.",
      "Feral: Ferocious Bite has 5 ranks with lower damage per rank. New Predatory Discipline stops Bite spending extra Energy.",
      "Feral: Shifting Power is a 1-rank talent and Improved Shifting Power is gone. Furor and Heart of the Wild swapped trees.",
      "Moonkin Form and Moonkin Aura crit now also covers attacks. Leader of the Pack crit also covers spells.",
      "Restoration: Wild Growth has a 3-second cast (was instant). Naturalist can cut it by 0.5 seconds.",
      "Restoration: Bloom replaces Gift of the Earthmother (heal when Rejuvenation or Regrowth ends). Genesis is 10%.",
    ],
    oct15: [
      "Moonkin Aura (spell crit) and Leader of the Pack (melee and ranged crit) reach the whole raid and stack.",
      "Faerie Fire makes threat in bear form, no longer procs Omen of Clarity, and can't stack from several druids.",
      "Insect Swarm's miss chance no longer stacks.",
      "Shred is learned at level 20 (was 22).",
      "Furor keeps your Energy when you shift from cat to bear.",
    ],
    oct8: [
      "Bear threat bonus is 50% (was 30%) and crits give 100% more rage.",
      "Demoralizing Roar makes threat on every enemy hit.",
      "Cat Form no longer lowers max health. Mana potions work in forms.",
      "Thorns is back to Vanilla damage with a 6% spell power ratio.",
      "Wrath ranks 1-5 retuned (slightly lower).",
      "Feral: Predatory Instincts is now Natural Instinct and adds healing from Intellect. Thick Hide no longer drops on gear swaps.",
      "Feral: Shifting Power can't be used at full Energy. Wolfshead Helm gives 5 Energy with it (was 20).",
    ],
    oct1: [
      "Tiger's Fury removed.",
      "Feral: new Shifting Power turns mana into 40 Energy (16 second cooldown). Improved Shifting Power cuts the cooldown.",
      "Bear crits give 75% more rage.",
      "Swipe scales with 3% of Attack Power (fix).",
      "All forms are immune to Disarm. Faerie Fire no longer resets your swing.",
      "Primal Bite makes about twice as much threat.",
      "King of the Jungle removed.",
    ],
    sept24: [
      "Mangle is renamed Primal Bite and its debuff is gone.",
      "Wrath hits about 50% harder.",
      "Rejuvenation, Tranquility and Wild Growth can crit.",
      "Thorns scales with your spell power.",
      "Primal Fury is Blood Frenzy again. Cat Feral Charge can't target allies.",
    ],
    launch: [
      "Omen of Clarity and Nature's Grasp are trained. Improved Mark of the Wild is baseline.",
      "Forms work better with weapons and consumables. Revive is an out-of-combat rez.",
      "Balance: Eclipse alternates Wrath and Starfire.",
      "Feral: scales with your weapon, and bears get Lacerate. Berserk capstone.",
      "Restoration: Wild Growth group HoT.",
    ],
  },
};

/** Patches in order, each with this class's lines (empty = no changes for this class). */
export function patchNotesFor(classId: ClassId): (Patch & { notes: string[] })[] {
  return PATCHES.map((p) => ({ ...p, notes: PATCH_NOTES[classId][p.id] ?? [] }));
}

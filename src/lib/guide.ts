import type { ClassId } from "./macros";

export type GuideSection = {
  id: string;
  title: string;
  body: string;
  bullets?: { term: string; meaning: string }[];
  example?: { title: string; code: string; note: string };
};

export type ForeverNote = {
  title: string;
  tag: string;
  body: string;
};

export type ClassGuide = {
  heading: string;
  intro: string;
  sections: GuideSection[];
  foreverHeading: string;
  foreverIntro: string;
  forever: ForeverNote[];
};

export const HOW_TO_CREATE: GuideSection = {
  id: "create",
  title: "Make a macro in-game",
  body: "Type /macro, click New, give it a name and an icon, paste the text, then drag the icon onto your action bar and bind a key. The character cap is 255. Stancebook shows the count on every card so you never overshoot.",
};

const RANK: GuideSection = {
  id: "rank",
  title: "Never put a rank on the bar",
  body: "In WoW Forever, a spell you dragged from the spellbook does not upgrade when you train the next rank. You have to drag it again. A /cast with no rank always uses the highest rank you know. That is the whole reason most of these macros exist.",
  example: {
    title: "Highest rank, always",
    code: "/cast Heroic Strike",
    note: "Not Heroic Strike(Rank 8). Exception: intentional downranks like Thunder Clap Rank 1.",
  },
};

function rankExample(code: string, note: string): GuideSection {
  return { ...RANK, example: { title: "Highest rank, always", code, note } };
}

const STARTATTACK: GuideSection = {
  id: "startattack",
  title: "/startattack before melee",
  body: "White swings stop when you tab to a new target, when a cast gets pushed, or when you simply never started attacking. Put /startattack above a melee /cast. It costs no resource and is not a GCD. If the spell cannot fire, you still hit.",
};

const GCD: GuideSection = {
  id: "gcd",
  title: "One GCD per press",
  body: "A macro is a priority list, not a rotation player. Every /cast line is tried from the top. The first one that is legal consumes the global cooldown. Everything under it is skipped for that press. On-next-swing abilities (Heroic Strike, Cleave, Raptor Strike, Maul) are the exception — they queue on a white hit and can sit next to a GCD spell.",
};

const TARGETS: GuideSection = {
  id: "targets",
  title: "Who the spell hits",
  body: "Unit conditions are written in square brackets, left to right. The first matching set wins. An empty [] means “no extra conditions” — usually your current target.",
  bullets: [
    { term: "@mouseover", meaning: "Unit under the cursor (nameplate, frame, world)." },
    { term: "@focus", meaning: "Your focus frame. Set with /focus." },
    { term: "@player", meaning: "You. Self-buffs and some items." },
    { term: "@pet", meaning: "Your pet. [@pet,dead] is how Revive Pet knows the corpse is there." },
    { term: "@cursor", meaning: "World location under the mouse. Traps, Flare, totems, Blizzard." },
    { term: "harm", meaning: "Must be an enemy." },
    { term: "help", meaning: "Must be friendly." },
    { term: "nodead / exists", meaning: "Skip corpses and empty frames so you do not waste the GCD." },
  ],
  example: {
    title: "Mouseover, else target",
    code: "/cast [@mouseover,harm,nodead][] Taunt",
    note: "Living enemy under the cursor. If there isn’t one, Taunt your target.",
  },
};

const MODS: GuideSection = {
  id: "mods",
  title: "Modifier keys",
  body: "One icon, several spells. Hold Shift, Ctrl, or Alt to pick a different line. Useful when you are out of bar space — not when you need the extra spell in a 0.2s window (interrupts should be their own key).",
  bullets: [
    { term: "[mod:shift]", meaning: "Shift is held." },
    { term: "[nomod]", meaning: "No modifier. The default press." },
    { term: "[mod:ctrl] / [mod:alt]", meaning: "Ctrl or Alt. Avoid Alt if your client uses it to show health bars." },
  ],
};

const COMBAT: GuideSection = {
  id: "combat",
  title: "Combat vs out of combat",
  body: "Charge is [nocombat]. Intercept is [combat]. Stealth is [nocombat] !Stealth; Vanish is the in-combat branch. That single flag is why those pairs can share a key.",
};

const SHOWTOOLTIP: GuideSection = {
  id: "showtooltip",
  title: "#showtooltip",
  body: "Without this, the bar shows a question-mark or a frozen icon. With a spell name, the icon stays on that spell. Bare #showtooltip follows whichever /cast would fire.",
};

const CANNOT: GuideSection = {
  id: "cannot",
  title: "What a macro cannot do",
  body: "Macros cannot play your rotation, wait for a cooldown, check rage, energy, or mana, or chain two GCD spells in one press. If a website sells you a one-button class, it is lying.",
};

const STANCE: GuideSection = {
  id: "stance",
  title: "Stances are numbered",
  body: "Conditionals use numbers, not names. Forever trains Tactical Mastery at level 14, so a swap keeps 10 rage. The swap still spends a GCD — first press changes stance, second press fires the spell.",
  bullets: [
    { term: "stance:1", meaning: "Battle Stance — Charge, Overpower, Retaliation" },
    { term: "stance:2", meaning: "Defensive Stance — Taunt, Shield Bash, Revenge, Shield Wall" },
    { term: "stance:3", meaning: "Berserker Stance — Whirlwind, Pummel, Intercept, Recklessness" },
  ],
};

const PET_ATTACK: GuideSection = {
  id: "petattack",
  title: "Send the pet on the same press",
  body: "A Classic pet or demon does not assist like a retail pet. It sits on the last thing you sent it to — including corpses. Put /petattack on Auto Shot or Shadow Bolt. It is not a GCD. Keep a hard-recall bind (passive + follow) for CC.",
  bullets: [
    { term: "/petattack", meaning: "Hit my current target. Harmless if no pet is out." },
    { term: "/petfollow + /petpassive", meaning: "Hard recall. Use it before Fear, sheep, Feign, Banish." },
  ],
  example: {
    title: "The leveling 1-key",
    code: "/petattack\n/cast !Auto Shot",
    note: "Warlocks do the same with Shadow Bolt instead of Auto Shot.",
  },
};

const AUTO_SHOT: GuideSection = {
  id: "bang",
  title: "The ! prefix never toggles off",
  body: "/cast Auto Shot and /cast Shoot toggle. A second press cancels them. The ! prefix means “turn it on.” Same trick for forms, Shadowform, Ghost Wolf, Inner Fire, and mage armor.",
};

const PET_STANCES: GuideSection = {
  id: "petstance",
  title: "Pet stances",
  body: "Classic pets were Passive, Defensive, or Aggressive. Forever adds Assist — the pet fights what you fight without chain-pulling the camp. Passive is for traps, sheep, Fear, and Feign.",
};

const COMBO: GuideSection = {
  id: "combo",
  title: "Combo points live on the target",
  body: "Builders add points to the current target. Finishers spend them. Points do not move when you tab. A macro cannot check your point count. Cat Form uses the same rule.",
};

const STEALTH: GuideSection = {
  id: "stealth",
  title: "Stealth is a condition, not a stance",
  body: "There is no stance:stealth. The standard Stealth/Vanish key is [nocombat] !Stealth; Vanish — the ! stops a second press from dropping you out. Prowl is the druid version and needs Cat Form first.",
  example: {
    title: "One stealth key",
    code: "/cast [nocombat] !Stealth; Vanish",
    note: "Out of combat: stealth on, never toggle off. In combat: Vanish.",
  },
};

const SEALS: GuideSection = {
  id: "seals",
  title: "Seals stay up",
  body: "In Forever, Judgement does not consume the Seal. Wear one Seal (Fury for tank, Command for Ret, Wisdom for Holy leveling) and press Judgement on its own cooldown.",
};

const FORMS: GuideSection = {
  id: "forms",
  title: "Forms are numbered like stances",
  body: "A form change is a GCD. Put ! on the form so a mashed key does not dump you into caster naked.",
  bullets: [
    { term: "stance:1", meaning: "Bear / Dire Bear" },
    { term: "stance:2", meaning: "Aquatic Form" },
    { term: "stance:3", meaning: "Cat Form" },
    { term: "stance:4", meaning: "Travel Form" },
    { term: "stance:5", meaning: "Moonkin or Tree of Life" },
    { term: "/cast !Cat Form", meaning: "Enter Cat. Will not toggle off." },
  ],
};

const SHOCKS: GuideSection = {
  id: "shocks",
  title: "Shocks share a cooldown",
  body: "Earth, Flame, and Frost Shock live on one cooldown. Give Earth Shock its own interrupt key with /stopcasting. Flame Shock is the DoT for Lava Burst. Frost is the snare you spend only when you do not need the kick.",
};

const STOPCAST: GuideSection = {
  id: "stopcast",
  title: "/stopcasting before the panic press",
  body: "A bolt in progress will eat the GCD and your Counterspell, Polymorph, Blink, Earth Shock, or Fear will wait. /stopcasting is not a GCD. Put it above any spell you must fire now.",
  example: {
    title: "Interrupt this press",
    code: "/stopcasting\n/cast [@mouseover,harm,nodead][] Counterspell",
    note: "Same pattern for Earth Shock, Fear, Hammer of Justice, Psychic Scream.",
  },
};

const MOUSEHEAL: GuideSection = {
  id: "mouseheal",
  title: "Mouseover the ally, keep your enemy targeted",
  body: "Almost never tab onto a friend. [@mouseover,help,nodead] first, then a friendly target, then [@player]. That chain is how you shield the tank while a DoT or Seal stays on the boss.",
  example: {
    title: "The heal chain",
    code: "/cast [@mouseover,help,nodead][@target,help,nodead][@player] Flash Heal",
    note: "Living ally under the cursor, else a friendly target, else you.",
  },
};

const TOTEMS: GuideSection = {
  id: "totems",
  title: "One Call, then project",
  body: "Call of the Elements drops the saved four totems. Totemic Projection [@cursor] moves them. Totemic Recall picks them up for mana. Still drop Grounding or Tremor on their own keys when the fight needs that slot.",
};

const BANES: GuideSection = {
  id: "banes",
  title: "Banes and Curses are different slots",
  body: "Forever turned Agony and Doom into Banes. Elements, Exhaustion, Recklessness stay Curses. If /cast Bane of Agony fails, your build may still say Curse of Agony — match the spellbook.",
};

const CAP: ForeverNote = {
  title: "255-character cap",
  tag: "Unchanged",
  body: "Forever did not raise the cap. Every card shows the count. If you go over, drop #showtooltip first.",
};

const WARRIOR_FOREVER: ForeverNote[] = [
  { title: "Victory Rush (level 20)", tag: "New spell", body: "After you kill a non-trivial enemy you have 20 seconds to press Victory Rush: instant, no rage, a heal. Train it the moment you hit 20." },
  { title: "Tactical Mastery is trained", tag: "Baseline", body: "Taught at 14. You keep 10 rage through a stance change without spending a talent point." },
  { title: "Vanguard — Charge in Defensive", tag: "Protection", body: "Charge while you stay in Defensive Stance. Use the Vanguard Charge macro, not Charge/Intercept, on Protection." },
  { title: "Thunder Clap in Defensive", tag: "Protection", body: "Legal in Battle and Defensive. Slow a pack without leaving tank stance." },
  { title: "Shield Wall retune", tag: "Changed", body: "60% damage reduction for 12 seconds (Classic was 75% for 10). Still requires Defensive Stance and a shield." },
  { title: "Rage from crits is 100%", tag: "Oct 8 patch", body: "Critical basic attacks now give full extra rage (Oct 1 added 75%, Oct 8 raised it to 100%). Heroic Strike and Cleave dumps come up more often, so keep them on an easy key." },
  { title: "Slam is an 18-second cooldown", tag: "Sept 24 patch", body: "Slam is no longer a spammable filler. Improved Slam cuts the cooldown by 1.5 or 3 seconds. Bind it as a cooldown, not your main button." },
  { title: "Spearing Strike wants Battle Stance", tag: "Oct 1 patch", body: "No two-hander needed anymore, but it only works in Battle Stance. Use a [stance:1] macro so one key stance-dances into it." },
  { title: "Weapon swap macros work again", tag: "Oct 8 patch", body: "You can swap several weapons inside one global cooldown again, so a two-hander to sword and shield /equip macro is back to one press." },
  { title: "Fury and Protection talents reshuffled", tag: "Oct 1 patch", body: "Berserker Rage is a level 30 skill, Flurry needs Death Wish (not Enrage), Bloodthirst hits harder (45% AP). Protection rows moved and Toughness is gone. Re-check your talents." },
  { title: "Smaller fixes", tag: "Oct 8 patch", body: "Deep Wounds is required again to reach Impale. Last Stand grants the right health. Demoralizing Shout now makes threat, so it is a real AoE threat button." },
  { title: "Battle Shout is raid-wide", tag: "Oct 15 patch", body: "It now reaches the whole raid, so one shout covers everyone. Keep it on a key you can refresh between pulls." },
  { title: "Slam ignores pushback", tag: "Oct 15 patch", body: "Getting hit no longer delays Slam, so the Slam cooldown key is safe to press in melee. Overpower also works on much lower-level enemies now." },
  CAP,
];

const HUNTER_FOREVER: ForeverNote[] = [
  { title: "Aimed Shot is trained at 20", tag: "New baseline", body: "2-second cast, 6-second cooldown shared with Multi-Shot. Separate binds, not a modifier pair." },
  { title: "Summon Hawk shares Arcane Shot’s cooldown", tag: "New spell", body: "Hawk on the plain press, Arcane on Shift. They belong on one key." },
  { title: "Intimidation is a guaranteed crit", tag: "Beast Mastery", body: "/petattack first so the stun and the crit land on your target, not a leftover corpse." },
  { title: "Assist pet stance", tag: "New command", body: "/petassist: the pet fights what you fight without chain-pulling. Swap to Passive before a trap or a sheep." },
  { title: "Strider Kick", tag: "New spell", body: "Melee kick plus 30% move speed for 3 seconds. /stopattack after it so you actually run." },
  { title: "Sniper Shot range", tag: "Oct 1 patch", body: "45-yard shot that adds 10 yards to your next 3 shots for 10 seconds. Open with it, then Aimed or Multi from far away." },
  { title: "Disengage drops more threat", tag: "Oct 8 patch", body: "Its threat reduction is doubled. Worth a key in groups again." },
  { title: "Expose Prey and Entrapment", tag: "Oct 8 patch", body: "Expose Prey lasts 10 seconds (was 5). Entrapment has diminishing returns and only procs when Frost Trap first goes off." },
  { title: "Pet changes", tag: "Oct 1 patch", body: "Aggressive Mode is back on the pet spellbook tab. Furious Howl gives 40% less AP. Unleashed Fury now actually raises pet damage (Oct 8). You can't tame beasts above your level." },
  { title: "Auto Shot waits half a second", tag: "Oct 15 patch", body: "You must stand still for 0.5 seconds before Auto Shot fires. Stop moving before your opener macro, or the first shot is lost." },
  { title: "Traps and pets", tag: "Oct 15 patch", body: "Fire Traps scale with Attack Power, and you can have one Fire and one Ice Trap out at once. Trueshot Aura is raid-wide, Strider Kick works while disarmed, and pet exotic skills got longer cooldowns." },
  CAP,
];

const ROGUE_FOREVER: ForeverNote[] = [
  { title: "Cutthroat — Ambush without stealth", tag: "Subtlety", body: "Ambush fires while you are visible. The Ambush → Backstab macro already tries Ambush first." },
  { title: "Mutilate", tag: "Assassination", body: "Dual wield, 2 combo points, extra damage if the target is poisoned. Replaces Sinister Strike on that spec." },
  { title: "Dirty Tricks", tag: "Subtlety", body: "Cuts the energy cost of Sap and Blind. The mouseover macros do not change; they just cost less." },
  { title: "Sap flags you for PvP", tag: "Sept 24 patch", body: "Sapping a PvP-flagged target flags you too. Watch the mouseover Sap near guards." },
  { title: "Expose Armor and Setup fixes", tag: "Oct 1 patch", body: "A missed Expose Armor no longer wipes your combo points. Setup only gives points on the target that you dodged or resisted." },
  { title: "Oct 8", tag: "No changes", body: "The Oct 8 patch had no rogue changes. Your macros are unchanged." },
  { title: "Small fixes", tag: "Oct 15 patch", body: "Sap no longer triggers weapon procs, and Cold Blood is used up correctly when Mutilate crits. No macro changes." },
  CAP,
];

const PALADIN_FOREVER: ForeverNote[] = [
  { title: "Judgement does not consume the Seal", tag: "Changed", body: "Put Seal of Fury or Command on once, then Judge on cooldown. Recasting the Seal every Judge is a wasted GCD." },
  { title: "Holy Strike at 6", tag: "New spell", body: "Short-cooldown holy melee hit. The Retribution filler, and the reason paladin melee is no longer auto-attack and wait." },
  { title: "Seal of Fury", tag: "Protection", body: "The new tank Seal. Judging it taunts. Pair it with Righteous Fury." },
  { title: "Consecration and Kings are trained", tag: "Baseline", body: "Both at 20. Blessings last an hour, so the blessing macro is a buff-window press, not a combat weave." },
  { title: "Undead paladins", tag: "Race", body: "Undead can be paladins. Exorcism still only hits Undead and Demons." },
  { title: "Holy Strike is a 10-second cooldown", tag: "Sept 24 patch", body: "Down from 12, and Improved Holy Strike is now baseline. Holy Power adds 15% crit to it. Press it on cooldown." },
  { title: "Retribution Aura nerfed", tag: "Oct 8 patch", body: "It now uses your spell power (6%) and Vanilla base damage, about a third lower. Fine for leveling, no longer a tank damage plan." },
  { title: "Holy Shield blocks 30%", tag: "Oct 1 patch", body: "Up from 20%. Redoubt was lowered to 4-20%. Holy Shield is the protection button to keep up." },
  { title: "Seal of Fury mana fix", tag: "Oct 8 patch", body: "It no longer restores mana without the talent, and its mana return no longer creates threat. Reckoning has a 1.5-second cooldown." },
  { title: "Righteous Fury and Vengeance", tag: "Sept 24 patch", body: "Righteous Fury's Holy threat is 60% (was 90%). Vengeance caps at 3 stacks and procs from any direct crit." },
  { title: "Salvation is its own buff", tag: "Oct 15 patch", body: "Blessing of Salvation is now Salvation and Mass Salvation, and it no longer replaces your other blessing. Revoke removes it from a tank. Update any [@mouseover] Salvation macro to the new name." },
  { title: "Reckoning and Righteous Fury", tag: "Oct 15 patch", body: "Reckoning stores up to 4 charges that fire on your next swing. Righteous Fury threat is up to 90%, so tanks should keep it on. Consecration and Champion of the Light numbers changed too." },
  CAP,
];

const PRIEST_FOREVER: ForeverNote[] = [
  { title: "Fear Ward and Devouring Plague for every race", tag: "Baseline", body: "Every priest trains both at 20. Put Fear Ward on the tank before a known fear." },
  { title: "Shadow Word: Death is trained", tag: "New baseline", body: "Trainer spell at 32. Instant Shadow, backlash if the target lives. An execute, not a filler." },
  { title: "Shadowform is the mana fix", tag: "Shadow", body: "Half-price Shadow spells, more damage, no healing. Cancel it (Shift on the Shadowform macro) before you Flash anyone." },
  { title: "Penance and Prayer of Mending", tag: "Talents", body: "Discipline’s capstone is Penance. Holy’s is Prayer of Mending. Both are mouseover macros in this book." },
  { title: "Divine Spirit and Lightwell are trained", tag: "Baseline", body: "Divine Spirit at 30, Lightwell at 40. Lightwell is a [@cursor] drop — the raid still has to click it." },
  { title: "Renew and Devouring Plague can crit", tag: "Sept 24 & Oct 1", body: "Renew crits (Sept 24) and Devouring Plague crits (Oct 1). Inner Focus no longer boosts periodic crits, so save it for a big direct heal or Mind Blast." },
  { title: "Power Word: Shield can overwrite", tag: "Sept 24 patch", body: "A shield can replace an existing one on a target without Weakened Soul. The mouseover Shield macro just works." },
  { title: "Penance retuned", tag: "Oct 8 patch", body: "Penance is now a true 2-second channel, with damage and healing lowered to match. Rank 1 costs 50% more mana. Don't move or recast during the channel." },
  { title: "Shadow Word: Death and Shadow Weaving", tag: "Oct 1 patch", body: "Early Demise now scales with target health, so Death is best as an execute. Shadow Weaving can no longer fail to apply." },
  { title: "Low-rank heals and Smite", tag: "Oct 8 patch", body: "Smite ranks 1-4, Lesser Heal and early Heal ranks were rebalanced. Downrank macros still work; the numbers just changed." },
  { title: "Shadow cooldowns are longer", tag: "Oct 15 patch", body: "Devouring Plague is now 24 seconds, Shadow Word: Death 18 seconds and Vampiric Embrace 30 seconds. Bind them as cooldowns, not rotation keys." },
  { title: "Shadow talents reshuffled", tag: "Oct 15 patch", body: "Dark Inspiration is new, Improved Mind Flay adds damage per tick, and Improved Fade and Shadow Infinity are gone. Re-check your talents." },
  CAP,
];

const SHAMAN_FOREVER: ForeverNote[] = [
  { title: "Call of the Elements", tag: "New spell", body: "Drop four totems in one cast. Totemic Recall picks them up for mana. Totemic Projection [@cursor] moves the set." },
  { title: "Lava Burst, Rage of the Farseer, Riptide", tag: "Capstones", body: "Every tree has a new 31-point talent. Lava Burst wants Flame Shock up. Riptide is an instant HoT that feeds Chain Heal." },
  { title: "Fire Nova is a spell", tag: "Changed", body: "It no longer eats the Fire totem slot. Drop Searing/Magma, then Nova explodes from that totem." },
  { title: "Lightning Bolt is faster", tag: "Changed", body: "Max rank is 2.5s (was 3s). Ghost Wolf is a 2s cast. Maelstrom Weapon can make bolts instant." },
  { title: "Water Shield", tag: "New shield", body: "Restoration’s mana shield. You still only wear one shield. Lightning Shield remains the melee default." },
  { title: "Flametongue Totem rework", tag: "Sept 24 patch", body: "No duration, replaced instantly by another Fire totem, and it does not stack with Flametongue Weapon or Windfury Totem. Pick one." },
  { title: "Air totems don't stack", tag: "Sept 24 patch", body: "Tranquil Air, Windfury and Grace of Air no longer stack. Drop one Air totem per group." },
  { title: "Totemic Recall gives mana again", tag: "Oct 1 patch", body: "Recall your totems after a pull to get mana back. Disease Cleansing Totem lasts 5 minutes." },
  { title: "Fire Nova keeps Elemental Focus", tag: "Oct 8 patch", body: "Fire Nova no longer eats your Clearcasting. Lightning Bolt ranks 1-5 were rebalanced, and Water Shield's tooltip now shows the mana it restores." },
  { title: "Lava Burst and Riptide", tag: "Sept 24 patch", body: "Lava Burst ranks 1-2 hit harder and Riptide can crit. Rage of the Farseer no longer adds cast speed." },
  { title: "Cheaper Chain Lightning", tag: "Oct 15 patch", body: "Chain Lightning costs about 35% less mana. Fire Nova was retuned, and the air and earth totems are raid-wide." },
  { title: "Elemental Mastery is back", tag: "Oct 15 patch", body: "It returns as the 31-point Elemental talent. Lava Burst moved to row 5 and Call of Thunder is gone. Stormstrike now costs mana. Re-check your talents." },
  CAP,
];

const MAGE_FOREVER: ForeverNote[] = [
  { title: "Frostfire Bolt at 40", tag: "New spell", body: "Trained, not talented. Fire and Frost in one bolt, so hybrid builds are legal." },
  { title: "Arcane is a real spec", tag: "Arcane", body: "Each Arcane Blast stacks a 15-second spell damage buff based on your Intellect (Oct 15 redesign). Keep casting to hold the stacks, and use Missiles when it procs." },
  { title: "Ice Lance and Fingers of Frost", tag: "Frost", body: "Instant. Weak unless the target is frozen. Not a Frostbolt replacement." },
  { title: "Heating Up", tag: "Fire", body: "Fire’s crit-chain talent. The Fireball and Fire Blast macros do not change." },
  { title: "Hot Streak is now Heating Up", tag: "Oct 1 patch", body: "Renamed, and it lasts 20 seconds (was 15). Combustion has 3 charges (was 4). If a macro says Hot Streak, update the name." },
  { title: "Arcane Missiles line of sight", tag: "Sept 24 patch", body: "Line of sight is only checked when the channel starts, so missiles keep flying if you or the target steps behind a pillar." },
  { title: "Impact fix", tag: "Oct 8 patch", body: "Impact no longer procs from Flamestrike's burn. Frostbolt, Fireball and Arcane Missiles ranks were smoothed out." },
  { title: "Winter's Chill and Improved Scorch", tag: "Oct 1 patch", body: "Neither debuff rolls to resist twice anymore, so they stack up more reliably." },
  { title: "Arcane Blast redesigned", tag: "Oct 15 patch", body: "Arcane Blast now gives you stacking spell damage for 15 seconds instead of making itself pricier. Arcane Wrath is a new talent. Keep Blast as your Arcane filler." },
  { title: "Frost Blast and frost changes", tag: "Oct 15 patch", body: "New Frost Blast (level 24) slows by 40%. Winter's Chill now empowers Cone of Cold, and Ice Lance on frozen targets is 200%. Fire Power was redesigned." },
  CAP,
];

const WARLOCK_FOREVER: ForeverNote[] = [
  { title: "Banes instead of some Curses", tag: "Changed", body: "Agony and Doom are Banes. Elements / Exhaustion / Recklessness stay Curses. Match the spellbook if Bane of Agony errors." },
  { title: "Incinerate, Wrack, Demonic Pact", tag: "Capstones", body: "Destruction’s 31 is Incinerate. Affliction’s is Wrack. Demonology’s is Demonic Pact." },
  { title: "The pet still needs /petattack", tag: "Unchanged", body: "Put /petattack on Shadow Bolt and Corruption. Keep a hard recall for Fear, Banish, and Howl." },
  { title: "Sayaad", tag: "Rename", body: "The Succubus line is the Sayaad. Summon names may say either — open the spellbook." },
  { title: "Summoning stuns the current pet", tag: "Oct 8 patch", body: "Your old pet is stunned while a new one is summoned. Don't swap pets mid-pull." },
  { title: "Hellfire can crit", tag: "Oct 1 patch", body: "Drain Soul now stops cleanly when you cast something else, so you can clip it on purpose. Soul Harvesting is renamed Soul Harvest." },
  { title: "Shadow Bolt and Demonic Brand", tag: "Oct 8 patch", body: "Shadow Bolt ranks 1-4 were rebalanced. Demonic Brand's pet bonus only makes high threat with Shadow damage." },
  { title: "Pet tab", tag: "Oct 1 patch", body: "Aggressive Mode is back on the pet spellbook tab. Voidwalker Sacrifice scales with 10% of spell healing." },
  { title: "Range talents", tag: "Oct 15 patch", body: "Malediction is replaced by Grim Reach (Affliction range), and Destructive Reach adds Destruction range. Shadow Mastery is up to 10%. Re-check your talents." },
  CAP,
];

const DRUID_FOREVER: ForeverNote[] = [
  { title: "Lacerate", tag: "New spell", body: "A Bear stacking bleed. Threat over time, not just a Maul dump." },
  { title: "Primal Bite and Berserk", tag: "Feral", body: "Primal Bite is the front-ok builder (Mangle’s job). Berserk is the capstone burst. If Primal Bite errors, the client may still say Mangle." },
  { title: "Eclipse", tag: "Balance", body: "Wrath shortens the next Starfires. Two keys, one loop. Moonfire remains the instant." },
  { title: "Wild Growth", tag: "Restoration", body: "AoE HoT that seeds from the ally you mouseover. Stacked melee loves it." },
  { title: "Nature’s Grasp and Omen of Clarity are trained", tag: "Baseline", body: "Grasp at 10, Omen at 20. Improved Mark of the Wild is also baseline." },
  { title: "Mangle is now Primal Bite", tag: "Sept 24 patch", body: "The macros use Primal Bite. Its debuff was removed and its threat roughly doubled on Oct 1, so it is the bear and cat builder." },
  { title: "Tiger's Fury is gone", tag: "Oct 1 patch", body: "Removed. New talent Shifting Power turns mana into 40 Energy in Cat Form (16-second cooldown, not usable at full Energy)." },
  { title: "Bear threat and rage", tag: "Oct 8 patch", body: "Bear and Dire Bear threat bonus is 50% (was 30%), crits give full extra rage, and Demoralizing Roar now makes threat. Swipe scales with Attack Power again." },
  { title: "Mana potions in forms", tag: "Oct 8 patch", body: "You can drink mana potions in Bear and Cat Form now, and Cat Form no longer lowers max health. Forms are immune to Disarm." },
  { title: "Wrath, Thorns and HoT crits", tag: "Sept 24 & Oct 8", body: "Wrath hits about 50% harder. Rejuvenation, Tranquility and Wild Growth can crit. Thorns is back to Vanilla values with a 6% spell power ratio." },
  { title: "Raid-wide auras and Faerie Fire", tag: "Oct 15 patch", body: "Moonkin Aura and Leader of the Pack are raid-wide. Faerie Fire makes threat in bear form and no longer procs Omen of Clarity, so it is a real tank pull button." },
  { title: "Feral fixes", tag: "Oct 15 patch", body: "Shred is learned at level 20. Furor keeps your cat Energy when you shift to bear. Rejuvenation ranks no longer block other druids." },
  CAP,
];

const CORE = [GCD, TARGETS, MODS, SHOWTOOLTIP, CANNOT];

const GUIDES: Record<ClassId, ClassGuide> = {
  warrior: {
    heading: "How warrior macros work",
    intro: "Macros in WoW Forever are Classic-era: 255 characters, no rotation brain, conditions checked left to right. The rules below are the ones that actually change how a warrior plays.",
    sections: [RANK, STARTATTACK, ...CORE.slice(0, 1), STANCE, ...CORE.slice(1, 3), COMBAT, ...CORE.slice(3)],
    foreverHeading: "What changed for warriors",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Victory Rush, baseline Tactical Mastery, and Charge in Defensive Stance are the three that actually change which macros you bind.",
    forever: WARRIOR_FOREVER,
  },
  paladin: {
    heading: "How paladin macros work",
    intro: "A paladin’s extra rule is Seals: Judgement no longer eats them, so your keys change.",
    sections: [rankExample("/cast Holy Strike", "Same rule for Flash of Light and Judgement."), STARTATTACK, SEALS, MOUSEHEAL, GCD, TARGETS, MODS, STOPCAST, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for paladins",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Holy Strike, Seal of Fury, Judgement that keeps the Seal, and baseline Consecration are the four that change which macros you bind.",
    forever: PALADIN_FOREVER,
  },
  hunter: {
    heading: "How hunter macros work",
    intro: "A hunter’s extra rule is the pet: it does not assist like a retail pet. You send it, or it sits on a corpse.",
    sections: [rankExample("/cast Serpent Sting", "Hunters almost never want a downrank."), PET_ATTACK, AUTO_SHOT, PET_STANCES, GCD, TARGETS, MODS, COMBAT, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for hunters",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Aimed Shot is trained, the pet gained Assist, and Summon Hawk / Strider Kick sit on shared cooldowns.",
    forever: HUNTER_FOREVER,
  },
  rogue: {
    heading: "How rogue macros work",
    intro: "A rogue’s extra rules are stealth, combo points, and /startattack so you never stand still between builders.",
    sections: [rankExample("/cast Sinister Strike", "A ranked icon from the spellbook will not upgrade when you train."), STARTATTACK, COMBO, STEALTH, GCD, TARGETS, MODS, COMBAT, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for rogues",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Cutthroat, Mutilate, and Dirty Tricks are the three that change which macros you bind.",
    forever: ROGUE_FOREVER,
  },
  priest: {
    heading: "How priest macros work",
    intro: "A priest’s extra rule is mouseover: never tab onto a friend if you can help it.",
    sections: [rankExample("/cast Flash Heal", "Downranks are a conscious choice, not a spellbook icon."), MOUSEHEAL, GCD, TARGETS, MODS, STOPCAST, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for priests",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Fear Ward for every race, SW:Death from the trainer, a Shadowform that actually has mana, and Penance / Prayer of Mending.",
    forever: PRIEST_FOREVER,
  },
  shaman: {
    heading: "How shaman macros work",
    intro: "A shaman’s extra rules are a shared shock cooldown and a totem bar that finally drops four at once.",
    sections: [rankExample("/cast Lightning Bolt", "Healing Wave downranks are a separate bind if you want them."), SHOCKS, TOTEMS, STARTATTACK, MOUSEHEAL, GCD, TARGETS, MODS, STOPCAST, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for shaman",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Call of the Elements, Lava Burst, Riptide, Fire Nova as a spell, and a faster Lightning Bolt.",
    forever: SHAMAN_FOREVER,
  },
  mage: {
    heading: "How mage macros work",
    intro: "A mage’s extra rule is /stopcasting: a bolt in progress will eat Blink, Counterspell, and sheep if you let it.",
    sections: [rankExample("/cast Frostbolt", "Rank 1 Frostbolt as a snare is a different macro, on purpose."), STOPCAST, AUTO_SHOT, GCD, TARGETS, MODS, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for mages",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Frostfire Bolt is trained, Arcane Blast makes Arcane a spec, and Ice Lance exists for shatter windows.",
    forever: MAGE_FOREVER,
  },
  warlock: {
    heading: "How warlock macros work",
    intro: "A warlock’s extra rule is the same as the hunter’s: the demon does not assist. You send it, or it sits on a corpse.",
    sections: [rankExample("/cast Shadow Bolt", "Corruption and Bane of Agony follow the same rule."), PET_ATTACK, BANES, GCD, TARGETS, MODS, STOPCAST, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for warlocks",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Agony and Doom are Banes, Destruction’s capstone is Incinerate, and the pet still needs /petattack on the filler.",
    forever: WARLOCK_FOREVER,
  },
  druid: {
    heading: "How druid macros work",
    intro: "A druid’s extra rules are numbered forms and mouseover heals so you can stay in Cat on the kill.",
    sections: [rankExample("/cast Rejuvenation", "Healing Touch downranks are a separate bind if you want them."), FORMS, STARTATTACK, MOUSEHEAL, GCD, TARGETS, MODS, SHOWTOOLTIP, CANNOT],
    foreverHeading: "What changed for druids",
    foreverIntro: "Updated with the Sept 24, Oct 1, Oct 8 and Oct 15 patches. Lacerate, Primal Bite, Berserk, Eclipse, and Wild Growth are the ones that change keys.",
    forever: DRUID_FOREVER,
  },
};

export function guideFor(classId: ClassId): ClassGuide {
  return GUIDES[classId];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
/** "Oct 15 patch" → sortable 1015; anything else → -1. */
function patchOrder(tag: string): number {
  const m = /^(\w+) (\d+) patch$/.exec(tag);
  const month = m ? MONTHS.indexOf(m[1] === "Sep" ? "Sept" : m[1]) : -1;
  return month < 0 ? -1 : (month + 1) * 100 + Number(m![2]);
}

/** The newest "<Mon D> patch" tag across every class, so all classes show the same patch. */
export const LATEST_PATCH: string = Object.values(GUIDES)
  .flatMap((g) => g.forever.map((n) => n.tag))
  .reduce((best, tag) => (patchOrder(tag) > patchOrder(best) ? tag : best), "");

/** This class's notes from the newest patch (empty when the patch didn't touch the class). */
export function latestPatchNotes(classId: ClassId): ForeverNote[] {
  return GUIDES[classId].forever.filter((n) => n.tag === LATEST_PATCH);
}

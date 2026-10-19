# Product

<!-- impeccable:product-schema 1 -->

_Facts below come from the README, the code, and the owner's requests in the project thread. Items marked (inferred) were not confirmed directly._

## Platform

web

## Users
WoW Forever (a classic-era World of Warcraft server) players setting up a character, usually with the game open beside it or alt-tabbed. They pick their class, find a macro, understand it, and paste it into `/macro`. Also used while leveling or planning talent builds. (inferred: mostly desktop, second monitor or alt-tab; some phone use.)

## Product Purpose
One place for ready-to-use macros for all nine classes, explained line by line, plus abilities, talents and Forever-specific patch changes. Success: find the right macro in seconds, trust it, copy it.

## Positioning
Curated for WoW Forever specifically: macros, talents and notes track Forever's changes from its patch notes each week, not generic Classic guides.

## Operating Context
Copy into the in-game macro window (255 character limit). Keybind planning on a 12-slot action bar. Runs as an installed PWA and a small Windows app (Neutralino, WebView2). Works offline after first load.

## Capabilities and Constraints
- Tabs: Spellbook (macros with spec/category filters, search, saved), Abilities, Talents (51 points, levels 10–60), How they work, Forever notes. Update button.
- Data lives in `src/lib/macros-*.ts`, `abilities.ts`, `guide.ts`, `src/data/talents/`; it must not change in a visual redesign.
- Icons load from wow.zamimg.com; strict CSP; built as a classic IIFE script so file:// works in the desktop wrapper.
- Local-only storage: favorites, action bar per class, talent builds.

## Brand Commitments
Name "Stancebook". The owner asked for "a sleek and modern design, kind of like a real WoW Forever skill book". Class colors follow WoW's official class colors. Real WoW spell icons.

## Evidence on Hand
Real macro, ability, talent and patch-note content in the repo. No testimonials or usage numbers; do not invent any.

## Product Principles
- Copying a correct macro fast beats everything else.
- Feel like it belongs next to the game client.
- Never lose the player's saved favorites, bars or builds.
- Show what is Forever-specific.

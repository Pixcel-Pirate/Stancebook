---
version: 1
slug: "src-components-app-shell-tsx"
primary_target: "src/components/app-shell.tsx"
related_targets: []
---

Scope: whole app shell and all tabs (Spellbook, Abilities, Talents, How they work, Forever notes). Mode: operate.
Audience: WoW Forever players with the game beside them; job: find, trust, copy a macro.

## Direction contract
THESIS: Holo-glass. Each class lights the book in its own color, like a scrying pane in the Violet Citadel. Replaces the obsidian-and-gold book (Oct 2026 redesign, owner asked for futuristic and sleek).
OWN-WORLD: Near-black blue ground (#06070c) with a slow class-colored aurora; frosted glass panes (backdrop blur) whose top edge catches the class light; glow trim tokens (glow, glow-hi, glow-lo) mixed from the class color; WoW tooltip navy for tooltips; real spell icons. Chakra Petch for headings, tabs and labels (uppercase, tracked, for section labels), Source Sans 3 for UI, Plex Mono for macro code only.
STORY: Pick a class, the light changes; scan sections, open a macro, copy it, drag it to the floating action dock.
FIRST VIEWPORT: Left rail of nine class crests; glass banner with class name, hint, count and tabs; list pane left, detail pane right; floating glass action dock at the bottom.
FORM: seed:e7a171e9f72cc731 (degraded roll, no challengers; owner pinned "futuristic").
SIGNATURE: switching class fades the registered --cls color everywhere, a beam of light crosses the banner, and the class name resolves out of a blur. Supporting motion: blurred page-in, short row cascade (capped at 180ms), press scale on buttons. Reduced motion keeps fades only.

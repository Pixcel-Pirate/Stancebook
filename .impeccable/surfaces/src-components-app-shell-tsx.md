---
version: 1
slug: "src-components-app-shell-tsx"
primary_target: "src/components/app-shell.tsx"
related_targets: []
---

Scope: whole app shell and all tabs (Spellbook, Abilities, Talents, How they work, Forever notes). Mode: operate.
Audience: WoW Forever players with the game beside them; job: find, trust, copy a macro.

## Direction contract
THESIS: Each class is its own book, dyed in its class color like a hanging order banner. Refuses the parchment-and-leather spellbook default.
OWN-WORLD: Obsidian violet-black ground, raised slate panels with a 1px gold hairline at the top edge, the active class color as a committed field in the header banner and rail, WoW tooltip navy for tooltips, real spell icons. Cinzel for headings only, Source Sans 3 for UI, Plex Mono for macro code.
STORY: Pick a class, the book re-dyes; scan sections, open a macro, copy it, drag it to the bar.
FIRST VIEWPORT: Left rail of nine class crests; header banner with class name, hint, count and tabs; list pane left, detail pane right; action bar pinned bottom.
FORM: candidate 3 of 7 (class order banners). seed:5034a97c43268203 (degraded roll, no challengers).
SIGNATURE: switching class animates the dye (registered --cls color property) across banner, rail and accents.

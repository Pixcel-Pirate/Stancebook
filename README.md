<div align="center">

<img src="public/icon-192.png" alt="" width="96" height="96">

# Stancebook

**A macro spellbook for World of Warcraft: Forever.**

Macros for all nine classes, explained line by line, ready to copy into <code>/macro</code>.

<a href="https://github.com/Pixcel-Pirate/Stancebook/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/Pixcel-Pirate/Stancebook?label=release&color=c9a227"></a>
<a href="https://github.com/Pixcel-Pirate/Stancebook/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/Pixcel-Pirate/Stancebook/total?color=2ea043"></a>
<a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
<img alt="Windows" src="https://img.shields.io/badge/Windows-0078D4?logo=windows&logoColor=white">
<img alt="React" src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=white">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
<img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white">
<img alt="PWA" src="https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white">
<a href="https://github.com/Pixcel-Pirate/Stancebook/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/Pixcel-Pirate/Stancebook"></a>

<br><br>

**[⬇ Download for Windows](https://github.com/Pixcel-Pirate/Stancebook/releases/latest/download/Stancebook-Setup.exe)** · **[Open the web app](https://pixcel-pirate.github.io/stancebook/)** · **[All releases](https://github.com/Pixcel-Pirate/Stancebook/releases)**

<a href="https://buymeacoffee.com/saucie83g"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="48"></a>

[What's inside](#whats-inside) · [Always up to date](#always-up-to-date) · [Install](#install) · [Privacy](#privacy) · [Build from source](#build-from-source) · [License](#license)

</div>

---

Stancebook collects ready-to-use macros for all nine classes in one place, with notes from the latest patches. It's styled like an in-game spellbook. Pick your class and find the macro you need. Read what each line does, then copy it straight into `/macro`.

## What's inside

- **Spellbook:** macros for Warrior, Paladin, Hunter, Rogue, Priest, Shaman, Mage, Warlock and Druid. You can filter them by spec (Arms, Holy, Feral…) and by use (starter, leveling, combat, tank, PvP, stance, utility). Every macro is explained line by line, with its character count against the 255 limit, a suggested keybind, and one-click copy. You can save your favorites.
- **Action bar:** drag macros onto a 12-slot bar (keys 1 to =) to plan your binds. Your bar is saved for each class.
- **Abilities:** every ability the macros use has its real WoW icon and an in-game style tooltip, plus links to the macros that use it.
- **Talents:** a talent calculator with all three trees for every class. Spend up to 51 points, from level 10 to 60, and your build is saved. Talents that are new or changed in Forever are marked.
- **How they work:** plain-language guides to macro rules such as conditionals, `/startattack`, stance dancing, mouseover heals and pet control.
- **Forever notes:** what changed for each class in WoW Forever, updated from the patch notes.

## Always up to date

Every Tuesday the patch notes are checked. Each new release updates the class notes, abilities and talents. When an update is out, a gold **Update** button appears in the app:
- **Desktop:** it downloads the new installer. Close Stancebook and run it, and your saved macros and builds are kept.
- **Web app:** it reloads with the new version.

## Install

**Windows app:** run [Stancebook-Setup.exe](https://github.com/Pixcel-Pirate/Stancebook/releases/latest/download/Stancebook-Setup.exe). It installs for your user only, needs no admin rights, and adds a desktop shortcut. The app isn't code-signed, so Windows may show "Windows protected your PC". If it does, click **More info**, then **Run anyway**.

**Web app (no warnings, works offline):** open https://pixcel-pirate.github.io/stancebook/ in Edge or Chrome. Then click **Install** in the address bar, or go to menu → Apps → Install Stancebook.

## Privacy

Stancebook has no accounts, no tracking and no ads. Your favorites, action bar and talent builds stay on your own computer. The only things it loads from the internet are the spell icons (from Wowhead's image server) and a check for new versions on GitHub.

## Build from source

    npm install
    npm run dev      # preview in the browser
    npm run build    # production build in dist/

Macros live in `src/lib/macros-*.ts`, guides and patch notes in `src/lib/guide.ts`, ability tooltips in `src/lib/abilities.ts`, and talent trees in `src/data/talents/`. Releases are built by `.github/workflows/release.yml`.

## License

[MIT](LICENSE) © 2026 Pixcel. If Stancebook saves you time, you can [buy me a coffee](https://buymeacoffee.com/saucie83g).

---

Talent data is summarized from [wowforevertalents.com](https://wowforevertalents.com). Stancebook is a fan project and is not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft and its icons are trademarks of Blizzard Entertainment.

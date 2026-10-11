# Stancebook — desktop

WoW Forever macro skillbook, packaged as a desktop app (Electron + Vite + React + Tailwind).

## Download (Windows)

**[⬇ Download Stancebook-Setup.exe](https://github.com/saucie83-ship-it/stancebook/raw/main/Stancebook-Setup.exe)** (2 MB)

Run it: it installs for your user only (no admin rights) and puts a Stancebook shortcut on your desktop. Windows may say "Windows protected your PC" because the app isn't code-signed; click **More info**, then **Run anyway**.

## Install as a web app (no warnings)

Open **https://saucie83-ship-it.github.io/stancebook/** in Edge or Chrome and click **Install** (the icon at the right of the address bar, or menu → Apps → Install Stancebook). You get a desktop icon and its own window, and it works offline.

## Windows installers (unsigned)
- **Stancebook Setup 1.0.0.exe** — installer. Adds a desktop shortcut and Start menu entry.
- **Stancebook-Portable-1.0.0.exe** — no install, just double-click.

Windows SmartScreen may warn because the app isn't code-signed: click **More info → Run anyway**.

## Build from source
    npm install
    npm run dev          # browser preview
    npm start            # run as desktop app
    npm run dist:win     # Windows installer + portable  (dist:mac / dist:linux also available)

Macro content lives in `src/lib/macros-*.ts`, guides in `src/lib/guide.ts`.

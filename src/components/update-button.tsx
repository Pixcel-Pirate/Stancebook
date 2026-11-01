import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";

const REPO = "Pixcel-Pirate/Stancebook";
const VERSION = import.meta.env.VITE_VERSION as string | undefined;
const DESKTOP = location.hostname === "127.0.0.1";
const INSTALLER = `https://github.com/${REPO}/releases/latest/download/Stancebook-Setup.exe`;

async function reloadFresh() {
  await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
  location.reload();
}

/**
 * Desktop: download the new book files (the release's resources.neu) next to Stancebook.exe, then hand off to a
 * tiny script that waits for the app to close, swaps the files in and reopens it. No installer, nothing in Downloads.
 * The swap happens after exit because Windows won't let a running app overwrite its own files.
 */
async function updateDesktop(tag: string) {
  // Neutralino injects its client and globals into the desktop window (injectGlobals/injectClientLibrary)
  const w = window as unknown as { Neutralino?: any; NL_PATH?: string };
  const N = w.Neutralino;
  if (!N || !w.NL_PATH) throw new Error("no native API");
  N.init();
  const dir = w.NL_PATH.replace(/\//g, "\\");
  const url = `https://github.com/${REPO}/releases/download/${tag}/resources.neu`;
  // curl.exe ships with Windows 10 and 11; -f leaves nothing behind on a failed download
  const r = await N.os.execCommand(`curl.exe -fsSL --retry 2 -o "${dir}\\resources.new" "${url}"`);
  if (r.exitCode !== 0) throw new Error(r.stdErr || "download failed");
  const script = [
    "@echo off",
    "chcp 65001 >nul",
    `for /l %%i in (1,1,15) do (move /y "${dir}\\resources.new" "${dir}\\resources.neu" >nul 2>&1 && goto run & ping -n 2 127.0.0.1 >nul)`,
    ":run",
    `start "" "${dir}\\Stancebook.exe"`,
    "",
  ].join("\r\n");
  await N.filesystem.writeBinaryFile(`${dir}\\update.cmd`, new TextEncoder().encode(script).buffer);
  await N.os.execCommand(`cmd /c start "" /min cmd /c "${dir}\\update.cmd"`, { background: true });
  await N.app.exit();
}

/** Checks GitHub when the book opens. If there's a newer release, pops up an update prompt and keeps a button in the header. */
export function UpdateButton() {
  const [latest, setLatest] = useState<string | null>(null);
  const [popup, setPopup] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!VERSION) return; // local/dev builds don't nag
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const tag = j?.tag_name;
        // only trust tags shaped like our release tags (vYYYY.MM.DD[.N])
        if (typeof tag === "string" && /^v\d{4}\.\d{2}\.\d{2}(\.\d+)?$/.test(tag) && tag !== VERSION) setLatest(tag);
      })
      .catch(() => {});
  }, []);

  if (!latest) return null;

  const cls = "btn-glow inline-flex h-9 items-center gap-2 rounded-md px-3 font-display text-sm font-bold disabled:opacity-60";
  async function update() {
    if (!DESKTOP) return reloadFresh();
    setBusy(true);
    try {
      await updateDesktop(latest!);
    } catch {
      setBusy(false);
      setFailed(true); // never auto-download the installer; the message links it for a manual fix
    }
  }
  const button = (label: string) => (
    <button type="button" className={cls} onClick={update} disabled={busy}>
      <Download className="size-4" /> {busy ? "Updating…" : label}
    </button>
  );

  return (
    <>
      {!(popup || failed) && button("Update")}

      {(popup || failed) &&
        createPortal(
        <div
          role="dialog"
          aria-label="Update available"
          className="fixed top-20 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2"
        >
          <div className="page rounded-md p-5 pr-10">
            <button
              type="button"
              aria-label="Close"
              onClick={() => (setPopup(false), setFailed(false))}
              className="absolute top-3 right-3 text-fg-faint hover:text-fg"
            >
              <X className="size-5" />
            </button>
            {failed ? (
              <>
                <p className="font-display text-lg font-bold text-fg">Update didn't finish</p>
                <p className="mt-1 text-fg-soft">
                  Check your internet and try again. If it keeps failing, install the latest{" "}
                  <a className="underline" href={INSTALLER}>Stancebook-Setup.exe</a> once. Your saved macros, action bar
                  and talents are kept.
                </p>
                <div className="mt-4 flex gap-2">{button("Try again")}</div>
              </>
            ) : (
              <>
                <p className="font-display text-lg font-bold text-fg">A new version of the book is out</p>
                <p className="mt-1 text-fg-soft">
                  {latest} is ready (you have {VERSION}).{" "}
                  {DESKTOP ? "Update installs it and restarts Stancebook." : "Update reloads the book with the new version."}
                </p>
                <div className="mt-4 flex gap-2">
                  {button("Update now")}
                  <button type="button" onClick={() => setPopup(false)} className="chip h-9!">
                    Later
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
,
          document.body,
        )}
    </>
  );
}

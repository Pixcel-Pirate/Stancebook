import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";

const REPO = "Pixcel-Pirate/Stancebook";
const VERSION = import.meta.env.VITE_VERSION as string | undefined;
const DESKTOP = location.hostname === "127.0.0.1";
const INSTALLER = `https://github.com/${REPO}/releases/latest/download/Stancebook-Setup.exe`;
// The desktop app's own files, published with the web app on every release.
const PACK = "https://pixcel-pirate.github.io/stancebook/desktop/resources.neu";

async function reloadFresh() {
  await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
  location.reload();
}

/** Desktop: swap in the new app files next to Stancebook.exe and restart. No installer. */
async function updateDesktop() {
  // Neutralino injects its client and globals into the desktop window (injectGlobals/injectClientLibrary)
  const w = window as unknown as { Neutralino?: any; NL_PATH: string };
  if (!w.Neutralino) throw new Error("no native API"); // installs from before in-place updates
  w.Neutralino.init();
  const r = await fetch(PACK, { cache: "no-store" });
  const pack = r.ok ? await r.arrayBuffer() : null;
  // a cut-off download would leave the app unable to start, so refuse anything that small
  if (!pack || pack.byteLength < 200_000) throw new Error("download failed");
  await w.Neutralino.filesystem.writeBinaryFile(w.NL_PATH + "/resources.neu", pack);
  await w.Neutralino.app.restartProcess();
}

/** Checks GitHub when the book opens. If there's a newer release, pops up an update prompt and keeps a button in the header. */
export function UpdateButton() {
  const [latest, setLatest] = useState<string | null>(null);
  const [popup, setPopup] = useState(true);
  const [downloaded, setDownloaded] = useState(false);
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

  const cls = "btn-gold inline-flex h-9 items-center gap-2 rounded-md px-3 font-display text-sm font-bold disabled:opacity-60";
  async function update() {
    if (!DESKTOP) return reloadFresh();
    setBusy(true);
    try {
      await updateDesktop();
    } catch {
      // builds from before in-place updates can't write their own files: fall back to the installer
      setBusy(false);
      setDownloaded(true);
      location.href = INSTALLER;
    }
  }
  const button = (label: string) => (
    <button type="button" className={cls} onClick={update} disabled={busy}>
      <Download className="size-4" /> {busy ? "Updating…" : label}
    </button>
  );

  return (
    <>
      {!(popup || downloaded) && button("Update")}

      {(popup || downloaded) &&
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
              onClick={() => (setPopup(false), setDownloaded(false))}
              className="absolute top-3 right-3 text-fg-faint hover:text-fg"
            >
              <X className="size-5" />
            </button>
            {downloaded ? (
              <>
                <p className="font-display text-lg font-bold text-fg">Almost done</p>
                <p className="mt-1 text-fg-soft">
                  When the download finishes, close Stancebook and run <b>Stancebook-Setup.exe</b>. Your saved macros,
                  action bar and talents are kept.
                </p>
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

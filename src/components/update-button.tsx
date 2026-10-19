import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const REPO = "Pixcel-Pirate/Stancebook";
const VERSION = import.meta.env.VITE_VERSION as string | undefined;
const DESKTOP = location.hostname === "127.0.0.1";
const INSTALLER = `https://github.com/${REPO}/releases/latest/download/Stancebook-Setup.exe`;

async function reloadFresh() {
  await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
  location.reload();
}

/** Checks GitHub when the book opens. If there's a newer release, pops up an update prompt and keeps a button in the header. */
export function UpdateButton() {
  const [latest, setLatest] = useState<string | null>(null);
  const [popup, setPopup] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

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

  const cls = "btn-gold inline-flex h-9 items-center gap-2 rounded-md px-3 font-display text-sm font-bold";
  const update = (extra = "") =>
    DESKTOP ? (
      <a className={cls + extra} href={INSTALLER} onClick={() => setDownloaded(true)}>
        <Download className="size-4" /> Update now
      </a>
    ) : (
      <button type="button" className={cls + extra} onClick={reloadFresh}>
        <Download className="size-4" /> Update now
      </button>
    );

  return (
    <>
      {!(popup || downloaded) && (DESKTOP ? (
        <a className={cls} href={INSTALLER} onClick={() => setDownloaded(true)} title={`Download ${latest}`}>
          <Download className="size-4" /> Update
        </a>
      ) : (
        <button type="button" className={cls} onClick={reloadFresh}>
          <Download className="size-4" /> Update
        </button>
      ))}

      {(popup || downloaded) && (
        <div
          role="dialog"
          aria-label="Update available"
          className="book fixed top-20 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2"
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
                  {DESKTOP ? "Update downloads the new installer." : "Update reloads the book with the new version."}
                </p>
                <div className="mt-4 flex gap-2">
                  {update()}
                  <button type="button" onClick={() => setPopup(false)} className="chip h-9!">
                    Later
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

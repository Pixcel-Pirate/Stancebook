import { useState } from "react";
import { X } from "lucide-react";
import ModelView from "@/components/model-view";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { QUALITY, SLOTS, WEARABLES, wearable, type Slot, type Wearable } from "@/lib/armory";
import { classMeta, type ClassId } from "@/lib/macros";
import { RACES } from "@/lib/races";
import { cn, useStored } from "@/lib/utils";

const MODEL_FILES = ".gltf,.glb,.bin,.obj,.mtl,.png,.jpg,.jpeg,.webp,.tga";

export const QUALITY_COLOR = ["#9d9d9d", "#fff", "#1eff00", "#0070dd", "#a335ee", "#ff8000"];
const ALL_SLOTS: Slot[] = [...SLOTS.left, ...SLOTS.right, ...SLOTS.bottom];

type Outfit = Partial<Record<Slot, number>>;
export type Look = { race: string; female: boolean; outfit: Outfit };
const isLook = (v: unknown): v is Look =>
  typeof v === "object" && v !== null && typeof (v as Look).race === "string" && typeof (v as Look).outfit === "object";

export const wowheadItem = (id: number) => `https://www.wowhead.com/classic/item=${id}`;

const tip = (w: Wearable) => ({
  name: w.n,
  icon: w.i,
  meta: `${QUALITY[w.q]} · ${w.type}`,
  desc: w.src,
});

export const useLook = () => useStored<Look>("stancebook.dressing-room", () => ({ race: "human", female: false, outfit: {} }), isLook);

/** Puts `w` in `slot`, or empties it, keeping two-handers and off-hands from overlapping. */
function equip(outfit: Outfit, slot: Slot, w: Wearable | undefined) {
  const next = { ...outfit };
  if (!w) delete next[slot];
  else {
    next[slot] = w.id;
    if (w.twoHand) delete next["Off Hand"];
    if (slot === "Off Hand" && wearable(next["Main Hand"] ?? 0)?.twoHand) delete next["Main Hand"];
  }
  return next;
}

/** "Try on" from a set card: every piece of the set goes in its slot. */
export function wearAll(look: Look, ids: number[]): Look {
  let outfit = look.outfit;
  for (const id of ids) {
    const w = wearable(id);
    if (w) outfit = equip(outfit, w.slots[0], w);
  }
  return { ...look, outfit };
}

/** Wowhead-style dressing room: pick a race and gender, then fill each paper-doll slot with Classic gear. */
export function DressingRoom({ classId, look, setLook }: { classId: ClassId; look: Look; setLook: (l: Look) => void }) {
  const [open, setOpen] = useState<Slot | null>(null);
  const [model, setModel] = useState<File[] | null>(null);
  const [modelNote, setModelNote] = useState("");
  const [dragging, setDragging] = useState(false);
  const openModel = (list: FileList | null) => {
    const picked = [...(list ?? [])];
    if (!picked.length) return;
    setModelNote("");
    setModel(picked);
  };
  const [query, setQuery] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const race = RACES.find((r) => r.id === look.race) ?? RACES[0];

  const fits = (w: Wearable) =>
    w.classes.some((c) => race.classes.includes(c)) &&
    (!w.faction || w.faction === race.faction) &&
    (!onlyMine || w.classes.includes(classId));

  const equipped = ALL_SLOTS.flatMap((s) => {
    const w = wearable(look.outfit[s] ?? 0);
    return w ? [[s, w] as const] : [];
  });
  const choices = open ? WEARABLES.filter((w) => w.slots.includes(open) && fits(w) && w.n.toLowerCase().includes(query.toLowerCase())) : [];

  const slotButton = (s: Slot) => {
    const w = wearable(look.outfit[s] ?? 0);
    const body = (
      <button
        type="button"
        aria-label={w ? `${s}: ${w.n}` : `${s}: empty`}
        aria-pressed={open === s}
        onClick={() => {
          setOpen(open === s ? null : s);
          setQuery("");
        }}
        className={cn(
          "flex size-14 items-center justify-center rounded-md bg-black/40 text-[0.55rem] font-bold tracking-wider text-fg-faint uppercase ring-1 ring-line transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]",
          open === s && "ring-2 ring-[var(--cls)]",
        )}
        style={w ? { boxShadow: `0 0 0 2px ${QUALITY_COLOR[w.q]}` } : undefined}
      >
        {w ? <SpellIcon ability={tip(w)} size={56} /> : s}
      </button>
    );
    return <li key={s}>{w ? <AbilityTip ability={tip(w)}>{body}</AbilityTip> : body}</li>;
  };

  return (
    <section
      className="flex flex-col gap-4 rounded-xl bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6"
      aria-label="Dressing room"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="mr-auto font-display text-2xl font-bold text-fg">Dressing room</h3>
        <button type="button" className="chip" aria-pressed={!look.female} onClick={() => setLook({ ...look, female: false })}>
          Male
        </button>
        <button type="button" className="chip" aria-pressed={look.female} onClick={() => setLook({ ...look, female: true })}>
          Female
        </button>
        <button
          type="button"
          className="chip disabled:opacity-50"
          onClick={() => setLook({ ...look, outfit: {} })}
          disabled={!equipped.length}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Race">
        {RACES.map((r) => (
          <button
            key={r.id}
            type="button"
            className="chip inline-flex items-center gap-2 pl-1"
            aria-pressed={race.id === r.id}
            onClick={() => setLook({ ...look, race: r.id })}
          >
            <SpellIcon
              ability={{
                name: r.name,
                icon: raceIcon(r.icon, look.female),
                meta: "",
                desc: "",
              }}
              size={24}
              className="rounded-full"
            />
            {r.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 sm:gap-6">
        <ul className="flex flex-col gap-2">{SLOTS.left.map(slotButton)}</ul>
        <div
          className={cn(
            "flex min-h-full flex-col items-center justify-center gap-3 rounded-lg bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--cls)_22%,transparent),transparent_70%)] py-6 text-center",
            dragging && "ring-2 ring-[var(--cls)]",
          )}
          onDragOver={(e) => (e.preventDefault(), setDragging(true))}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            openModel(e.dataTransfer.files);
          }}
        >
          {model ? (
            <ModelView files={model} onError={setModelNote} />
          ) : (
            <>
              <SpellIcon
                ability={{
                  name: race.name,
                  icon: raceIcon(race.icon, look.female),
                  meta: "",
                  desc: "",
                }}
                size={128}
                className="rounded-full"
                glow
              />
              <p className="font-display text-xl font-bold text-fg">
                {look.female ? "Female" : "Male"} {race.name}
              </p>
              <p
                className={cn("text-xs font-bold tracking-wider uppercase", race.faction === "Alliance" ? "text-sky-300" : "text-red-300")}
              >
                {race.faction}
              </p>
              <p className="max-w-56 text-xs text-fg-faint">
                {equipped.length ? `${equipped.length} of ${ALL_SLOTS.length} slots filled.` : "Click a slot to put gear on."} Open any
                piece on Wowhead to see it in 3D, or open a model you exported from your game.
              </p>
            </>
          )}
          {!model && (
            <p className="max-w-64 text-xs text-fg-faint">
              Export a character from your game with wow.export as glTF or OBJ, then pick every file in the export folder (or drop them
              here). Nothing leaves your PC.
            </p>
          )}
          {modelNote && (
            <p className="max-w-80 px-2 text-xs text-amber-300" role="status">
              {modelNote}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <label className="chip inline-flex cursor-pointer items-center focus-within:ring-2 focus-within:ring-[var(--cls)]">
              {model ? "Open another model" : "Open 3D model"}
              <input
                type="file"
                multiple
                accept={MODEL_FILES}
                className="sr-only"
                onChange={(e) => (openModel(e.target.files), (e.target.value = ""))}
              />
            </label>
            {model && (
              <button type="button" className="chip" onClick={() => (setModel(null), setModelNote(""))}>
                Close model
              </button>
            )}
          </div>
        </div>
        <ul className="flex flex-col gap-2">{SLOTS.right.map(slotButton)}</ul>
      </div>
      <ul className="flex justify-center gap-2">{SLOTS.bottom.map(slotButton)}</ul>

      {open && (
        <div className="flex flex-col gap-3 rounded-lg bg-black/30 p-3 ring-1 ring-line">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-auto text-xs font-bold tracking-[0.18em] text-cls uppercase">
              {open}{" "}
              <span className="text-fg-faint">
                · {choices.length} for a {race.name}
              </span>
            </p>
            <button type="button" className="chip" aria-pressed={onlyMine} onClick={() => setOnlyMine(!onlyMine)}>
              Only {classMeta(classId).label.toLowerCase()}
            </button>
            {look.outfit[open] && (
              <button
                type="button"
                className="chip"
                onClick={() =>
                  setLook({
                    ...look,
                    outfit: equip(look.outfit, open, undefined),
                  })
                }
              >
                Take off
              </button>
            )}
            <button type="button" className="chip" aria-label="Close" onClick={() => setOpen(null)}>
              <X className="size-4" />
            </button>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            aria-label={`Search ${open} items`}
            className="h-9 rounded-md bg-white/[0.05] px-3 text-sm text-fg ring-1 ring-line outline-none placeholder:text-fg-faint focus-visible:ring-2 focus-visible:ring-[var(--cls)]"
          />
          {choices.length === 0 ? (
            <p className="text-sm text-fg-soft">
              Nothing in the Armory fits this slot for a {race.name}
              {onlyMine ? ` ${classMeta(classId).label.toLowerCase()}` : ""}.
            </p>
          ) : (
            <ul className="grid max-h-80 gap-1 overflow-y-auto sm:grid-cols-2">
              {choices.map((w) => (
                <li key={w.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setLook({ ...look, outfit: equip(look.outfit, open, w) });
                      setOpen(null);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md p-1.5 text-left hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none",
                      look.outfit[open] === w.id && "bg-white/[0.08]",
                    )}
                  >
                    <SpellIcon ability={tip(w)} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold" style={{ color: QUALITY_COLOR[w.q] }}>
                        {w.n}
                      </span>
                      <span className="block truncate text-xs text-fg-faint">
                        {w.type} · {w.src}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {equipped.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Equipped</caption>
            <thead className="text-xs tracking-wider text-fg-faint uppercase">
              <tr>
                <th className="py-2 pr-3 font-bold">Equipped</th>
                <th className="py-2 pr-3 font-bold">Slot</th>
                <th className="py-2 pr-3 font-bold">Type</th>
                <th className="py-2 font-bold">Source</th>
              </tr>
            </thead>
            <tbody>
              {equipped.map(([s, w]) => (
                <tr key={s} className="border-t border-line">
                  <td className="py-2 pr-3">
                    <a
                      href={wowheadItem(w.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-semibold hover:underline"
                      style={{ color: QUALITY_COLOR[w.q] }}
                    >
                      <SpellIcon ability={tip(w)} size={24} />
                      {w.n}
                    </a>
                  </td>
                  <td className="py-2 pr-3 text-fg-soft">{s}</td>
                  <td className="py-2 pr-3 text-fg-soft">{w.type}</td>
                  <td className="py-2 text-fg-faint">{w.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** Classic race icons come in male and female versions; Skyborne's emblem has only one. */
function raceIcon(icon: string, female: boolean) {
  return female && icon.endsWith("_male") ? icon.replace(/_male$/, "_female") : icon;
}

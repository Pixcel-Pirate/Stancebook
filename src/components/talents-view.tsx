import { useEffect, useState } from "react";
import { Check, ChevronDown, Link2, RotateCcw, Save, Star, Trash2 } from "lucide-react";
import { AbilityTip, ClassIcon, CLASS_ICON, SpellIcon } from "@/components/spell-icon";
import { ICON_CDN } from "@/lib/abilities";
import { classMeta, type ClassId } from "@/lib/macros";
import {
  canAdd,
  canRemove,
  change,
  decode,
  encode,
  fill,
  grandTotal,
  lockReason,
  pointsAt,
  rankOf,
  rankText,
  treeTotal,
  type Spent,
} from "@/lib/talent-rules";
import { SPEC_ART, TALENTS_SOURCE, treesFor, type Talent, type Tree } from "@/lib/talents";
import { useStored } from "@/lib/utils";

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isSpent = (v: unknown): v is Spent =>
  isObj(v) &&
  Object.entries(v).every(
    ([k, tree]) => ["0", "1", "2"].includes(k) && isObj(tree) && Object.values(tree).every((r) => Number.isInteger(r) && (r as number) >= 0 && (r as number) <= 5),
  );
type Saved = { name: string; code: string }[];
const isSaved = (v: unknown): v is Saved =>
  Array.isArray(v) && v.every((b) => isObj(b) && typeof b.name === "string" && typeof b.code === "string");
const isLevel = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 10 && (v as number) <= 60;

/** Shareable link: #talents=<class>:<code>. */
export const TALENT_HASH = /^#talents=([a-z]+):([0-9-]*)$/;
const linkFor = (id: ClassId, code: string) => `${location.origin}${location.pathname}#talents=${id}:${code}`;

/** Talent calculator laid out like the in-game frame: left click adds, right click removes, shift-click fills. */
export function TalentsView({ classId }: { classId: ClassId }) {
  const trees = treesFor(classId);
  const meta = classMeta(classId);
  const [level, setLevel] = useStored("stancebook-talent-level", () => 60, isLevel);
  const [saved, setSpent] = useStored(`stancebook-talents-${classId}`, (): Spent => ({}), isSpent);
  const [builds, setBuilds] = useStored(`stancebook-builds-${classId}`, (): Saved => [], isSaved);
  const [copied, setCopied] = useState(false);
  const max = pointsAt(level);
  // replay the stored build through the rules: patches move, remove and re-rank talents
  const spent = decode(trees, encode(trees, saved), max);
  const total = grandTotal(spent);
  const code = encode(trees, spent);

  // open a shared link once, then drop it from the address bar so a reload keeps later edits
  useEffect(() => {
    const m = TALENT_HASH.exec(location.hash);
    if (!m || m[1] !== classId) return;
    setSpent(decode(trees, m[2], max));
    history.replaceState(null, "", location.pathname + location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  function click(tree: number, t: Talent, remove: boolean, all: boolean) {
    if (all) return setSpent(fill(trees, spent, tree, t, remove, max));
    if (remove ? canRemove(trees, spent, tree, t) : canAdd(trees, spent, tree, t, max)) setSpent(change(spent, tree, t, remove ? -1 : 1));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(linkFor(classId, code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this build link:", linkFor(classId, code));
    }
  }

  function saveBuild() {
    const name = window.prompt("Name this build", trees.map((_, i) => treeTotal(spent, i)).join("/"))?.trim();
    if (name) setBuilds([...builds.filter((b) => b.name !== name), { name, code }]);
  }

  const ClassFallback = CLASS_ICON[classId];

  if (!trees.length) return <p className="py-10 text-center text-fg-soft italic">Talent data for this class isn’t loaded yet.</p>;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-16">
      <header className="code-panel flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="slot size-12">
              <ClassIcon id={classId} size={48} fallback={<ClassFallback className="size-6" />} />
            </span>
            <div>
              <h2 className="font-display text-2xl leading-tight font-bold">
                <span className="glow-text">{meta.label}</span> talents
              </h2>
              <label className="flex items-center gap-2 text-sm text-fg-soft">
                Level
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={level}
                  onChange={(e) => {
                    const v = Math.round(+e.target.value);
                    if (isLevel(v)) setLevel(v);
                  }}
                  className="w-16 rounded-md bg-inset px-2 py-0.5 font-mono font-bold text-warn ring-1 ring-line focus:ring-glow focus:outline-none"
                />
              </label>
            </div>
          </div>
          <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm text-fg-soft">
            <div className="flex gap-1.5">
              <dt>Points left</dt>
              <dd className="font-mono font-bold text-warn tabular-nums">{max - total}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Required level</dt>
              <dd className="font-mono font-bold text-fg tabular-nums">{total ? total + 9 : "–"}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="sr-only">Points per tree</dt>
              <dd className="font-mono font-bold text-fg tabular-nums">{trees.map((_, i) => treeTotal(spent, i)).join(" / ")}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={copyLink} disabled={!total} className="btn-glow inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-bold disabled:opacity-40">
            {copied ? <Check className="size-4" /> : <Link2 className="size-4" />} {copied ? "Link copied" : "Copy build link"}
          </button>
          <button type="button" onClick={saveBuild} disabled={!total} className="btn-glass inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold disabled:opacity-40">
            <Save className="size-4" /> Save build
          </button>
          <details className="relative">
            <summary className="btn-glass inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 text-sm font-semibold">
              My builds ({builds.length}) <ChevronDown className="size-4" />
            </summary>
            <ul className="absolute top-full left-0 z-20 mt-1 w-64 rounded-lg bg-surface-hi p-1 shadow-xl ring-1 ring-line">
              {builds.length === 0 && <li className="px-3 py-2 text-sm text-fg-faint">No saved builds yet.</li>}
              {builds.map((b) => (
                <li key={b.name} className="flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      setSpent(decode(trees, b.code, max));
                      e.currentTarget.closest("details")?.removeAttribute("open");
                    }}
                    className="flex-1 truncate rounded-md px-3 py-2 text-left text-sm hover:bg-white/5"
                  >
                    {b.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${b.name}`}
                    onClick={() => setBuilds(builds.filter((x) => x !== b))}
                    className="rounded-md p-2 text-fg-faint hover:bg-white/5 hover:text-rust"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </details>
          <button type="button" onClick={() => setSpent({})} disabled={!total} className="btn-glass inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold disabled:opacity-40">
            <RotateCcw className="size-4" /> Reset all
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {trees.map((tree, ti) => (
          <TreePane key={tree.tree} classId={classId} trees={trees} ti={ti} spent={spent} max={max} onClick={click} onReset={() => setSpent({ ...spent, [ti]: {} })} />
        ))}
      </div>

      <Legend trees={trees} />
      <p className="text-xs text-fg-faint">
        Talent data paraphrased from{" "}
        <a className="underline hover:text-fg" href={TALENTS_SOURCE} target="_blank" rel="noreferrer">
          wowforevertalents.com
        </a>{" "}
        (Forever client, 30 October 2026). Your build is saved on this device.
      </p>
    </div>
  );
}

function TreePane({
  classId,
  trees,
  ti,
  spent,
  max,
  onClick,
  onReset,
}: {
  classId: ClassId;
  trees: Tree[];
  ti: number;
  spent: Spent;
  max: number;
  onClick: (tree: number, t: Talent, remove: boolean, all: boolean) => void;
  onReset: () => void;
}) {
  const tree = trees[ti];
  const [icon, a, b] = SPEC_ART[classId][ti];
  const pts = treeTotal(spent, ti);
  const pos = (t: Talent) => ({
    left: `calc(${t.c - 1} * var(--px) + (var(--px) - var(--ic)) / 2)`,
    top: `calc(${t.t - 1} * var(--py) + 0.5rem)`,
  });
  return (
    <section className="tree-pane" style={{ "--a": a, "--b": b } as React.CSSProperties}>
      <header className="flex items-center gap-3 px-3 py-2.5 shadow-[inset_0_-1px_0_var(--color-line)]">
        <SpellIcon ability={{ name: tree.tree, icon, meta: "", desc: "" }} size={32} />
        <h3 className="flex-1 font-display text-lg font-semibold">{tree.tree}</h3>
        <span className="font-mono font-bold text-warn tabular-nums">{pts}</span>
        <button type="button" onClick={onReset} disabled={!pts} className="rounded px-1.5 text-xs font-semibold tracking-wider text-fg-soft uppercase hover:text-fg disabled:opacity-30">
          Reset
        </button>
      </header>
      <div className="tree-body">
        <img className="tree-art" src={ICON_CDN + icon + ".jpg"} alt="" loading="lazy" draggable={false} />
        <div className="tree-grid">
          {tree.talents.map((t) => {
            const p = t.p && tree.talents.find((u) => u.n === t.p);
            if (!p) return null;
            const lit = rankOf(spent, ti, p.n) === p.r;
            const down = p.c === t.c;
            const style = down
              ? { left: `calc(${p.c - 1} * var(--px) + var(--px) / 2 - 1px)`, top: `calc(${p.t - 1} * var(--py) + 0.5rem + var(--ic) + 2px)`, height: `calc(${t.t - p.t} * var(--py) - var(--ic) - 10px)` }
              : { top: `calc(${p.t - 1} * var(--py) + 0.5rem + var(--ic) / 2 - 1px)`, left: `calc(${p.c - 1} * var(--px) + (var(--px) + var(--ic)) / 2 + 4px)`, width: `calc(${t.c - p.c} * var(--px) - var(--ic) - 14px)` };
            return <span key={`${p.n}>${t.n}`} className="tree-arrow" data-dir={down ? "down" : "right"} data-lit={lit || undefined} style={style} />;
          })}
          {tree.talents.map((t) => {
            const rank = rankOf(spent, ti, t.n);
            const lock = lockReason(trees, spent, ti, t);
            const state = rank === t.r ? "max" : rank ? "partial" : canAdd(trees, spent, ti, t, max) ? "open" : "locked";
            const req = [lock, t.s === "n" ? "New in Forever" : t.s === "c" ? "Changed from Classic" : ""].filter(Boolean).join(" · ");
            return (
              <div key={t.n} className="talent" data-state={state} style={pos(t)}>
                <AbilityTip
                  className="block size-full"
                  ability={{ name: t.n, icon: t.i ?? "", meta: `Rank ${rank}/${t.r}${req ? ` · ${req}` : ""}`, desc: rankText(t, rank), next: rank > 0 && rank < t.r ? rankText(t, rank + 1) : undefined }}
                >
                  <button
                    type="button"
                    aria-label={`${t.n}, rank ${rank} of ${t.r}`}
                    onClick={(e) => onClick(ti, t, false, e.shiftKey)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onClick(ti, t, true, e.shiftKey);
                    }}
                    className="relative block size-full"
                  >
                    <SpellIcon ability={{ name: t.n, icon: t.i ?? "", meta: "", desc: "" }} size={44} />
                    {t.s && <span className="mark">{t.s === "n" ? <Star /> : <i className="mark-diamond" />}</span>}
                    <span className="rank-badge">
                      {rank}/{t.r}
                    </span>
                  </button>
                </AbilityTip>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Legend({ trees }: { trees: Tree[] }) {
  const all = trees.flatMap((t) => t.talents);
  const count = (s?: "n" | "c") => all.filter((t) => t.s === s).length;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-soft">
      <span className="flex items-center gap-2">
        <span className="mark static">
          <Star />
        </span>
        New in Forever ({count("n")})
      </span>
      <span className="flex items-center gap-2">
        <span className="mark static">
          <i className="mark-diamond" />
        </span>
        Changed from Classic ({count("c")})
      </span>
      <span>Unmarked: same as Classic ({count()})</span>
      <span className="ml-auto text-fg-faint">Left click adds a point, right click removes, shift-click fills.</span>
    </div>
  );
}

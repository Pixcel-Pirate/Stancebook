import { useState } from "react";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { BIS, BIS_ITEMS, BIS_LEVELS, QUALITY, QUALITY_COLOR, type BisFlag, type BisKind, type BisPick } from "@/lib/armory";
import { classMeta, type ClassId } from "@/lib/macros";
import { cn } from "@/lib/utils";

const FOREVER_ERA = "https://theforeverera.com/en/bis/";
const ADDON = "https://www.curseforge.com/wow/addons/forever-leveling-bis";
const itemLink = (id: number, flag: BisFlag) => `https://theforeverera.com/en/items/${flag === "N" ? `${id}/` : `#item-${id}`}`;
const FLAG: Record<Exclude<BisFlag, "">, [label: string, style: string, tip: string]> = {
  N: ["New in Forever", "bg-emerald-400/15 text-emerald-300", "A new WoW Forever item."],
  C: ["Changed", "bg-sky-400/15 text-sky-300", "Exists in Forever with different stats from Classic."],
  X: ["Not in client", "bg-amber-400/15 text-amber-300", "Isn't in the Forever game client yet, so it may be cut or replaced."],
};
// The addon's source sections, in its order, plus vendor and world drops, which it counts as BoE.
const KINDS: [BisKind, string][] = [["q", "Quest"], ["d", "Dungeon & raid"], ["c", "Crafted"], ["v", "Vendor"], ["w", "World drop"], ["u", "Unknown"]];
const KIND_LABEL = Object.fromEntries(KINDS) as Record<BisKind, string>;
const bracketFor = (level: number) => [...BIS_LEVELS].reverse().find((l) => l <= level) ?? BIS_LEVELS[0];

function tipFor([id, src, flag]: BisPick, slot: string) {
  const it = BIS_ITEMS[id];
  const meta = [QUALITY[it.q], slot, it.r ? `Requires level ${it.r}` : "", flag && FLAG[flag][0]].filter(Boolean).join(" · ");
  return { name: it.n, icon: it.i, meta, desc: [src, flag && FLAG[flag][2]].filter(Boolean).join(" ") };
}

/**
 * WoW Forever best-in-slot gear for each spec, laid out like the Forever Leveling BiS addon: pick a level (or type yours),
 * see the best item per slot with its ranked alternatives and where each comes from, switch sources off, and look ahead
 * to the next bracket's upgrades. Level 60 is the endgame raid list.
 */
export function BisView({ classId }: { classId: ClassId }) {
  const specs = BIS.find((b) => b.cls === classId)?.specs ?? [];
  const [pick, setPick] = useState({ classId, spec: 0 });
  const [level, setLevel] = useState<number>(BIS_LEVELS[0]);
  const [off, setOff] = useState<BisKind[]>([]);
  const [ahead, setAhead] = useState(false);
  const spec = specs[pick.classId === classId ? pick.spec : 0];
  if (!spec) return null;

  const bracket = bracketFor(level);
  const next = BIS_LEVELS.find((l) => l > bracket);
  const usable = (picks: BisPick[]) => picks.filter((p) => !off.includes(p[3]));
  const slots = spec.levels[bracket];
  const nextBest = new Map((next ? spec.levels[next] : []).map(([s, p]) => [s, usable(p)[0]]));
  const counts = new Map<BisKind, number>();
  for (const [, picks] of slots) counts.set(picks[0][3], (counts.get(picks[0][3]) ?? 0) + 1);
  const toggle = (k: BisKind) => setOff(off.includes(k) ? off.filter((x) => x !== k) : [...off, k]);

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6" aria-label="Best in slot">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold text-fg">Best in slot · {classMeta(classId).label}</h3>
        <p className="max-w-prose text-sm text-fg-soft">
          The best WoW Forever gear for your level and where to get it, laid out like the{" "}
          <a className="text-cls hover:underline" href={ADDON} target="_blank" rel="noreferrer">
            Forever Leveling BiS
          </a>{" "}
          addon. Lists come from{" "}
          <a className="text-cls hover:underline" href={FOREVER_ERA} target="_blank" rel="noreferrer">
            The Forever Era
          </a>
          , built from the Forever client. Level 60 is the endgame raid list. Many drop rates are still Classic data.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Spec">
        {specs.map((s, k) => (
          <button key={s.name} type="button" className="chip" aria-pressed={spec === s} onClick={() => setPick({ classId, spec: k })}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Level">
        {BIS_LEVELS.map((l) => (
          <button key={l} type="button" className="chip" aria-pressed={bracket === l} onClick={() => setLevel(l)}>
            {l === 60 ? "60 · Endgame" : `Level ${l}`}
          </button>
        ))}
        <label className="chip flex items-center gap-2">
          My level
          <input
            type="number"
            min={1}
            max={60}
            value={level}
            onChange={(e) => setLevel(Math.min(60, Math.max(1, Number(e.target.value) || 1)))}
            className="w-12 bg-transparent text-fg outline-none"
          />
        </label>
        {next && (
          <button type="button" className="chip" aria-pressed={ahead} onClick={() => setAhead(!ahead)}>
            Look ahead to {next}
          </button>
        )}
      </div>
      {level < BIS_LEVELS[0] && <p className="text-xs text-fg-faint">Lists start at level 20, so this shows the level 20 gear to aim for.</p>}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Sources">
        {KINDS.map(([k, name]) => (
          <button key={k} type="button" className="chip" aria-pressed={!off.includes(k)} onClick={() => toggle(k)}>
            {name}
            {counts.get(k) ? <span className="ml-1.5 text-fg-faint">{counts.get(k)}</span> : null}
          </button>
        ))}
      </div>

      <ul className="grid gap-1.5 md:grid-cols-2">
        {slots.map(([slot, all]) => {
          const [best, ...alts] = usable(all);
          const up = ahead ? nextBest.get(slot) : undefined;
          return (
            <li key={slot} className="flex flex-col gap-2 rounded-lg bg-white/[0.035] p-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
              {best ? <Pick pick={best} slot={slot} /> : <p className="p-2 text-sm text-fg-faint">{slot}: nothing from the sources you picked.</p>}
              {alts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-[52px]">
                  {alts.map((p, k) => (
                    <Alt key={p[0]} pick={p} slot={slot} rank={k + 2} />
                  ))}
                </div>
              )}
              {up && up[0] !== best?.[0] && (
                <div className="flex items-center gap-2 pl-[52px] text-xs text-fg-soft">
                  <span className="text-[0.65rem] font-bold tracking-wider text-fg-faint uppercase">At {next}</span>
                  <Alt pick={up} slot={slot} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Pick({ pick, slot }: { pick: BisPick; slot: string }) {
  const [id, src, flag, kind] = pick;
  const it = BIS_ITEMS[id];
  const tip = tipFor(pick, slot);
  return (
    <div className="flex items-center gap-3">
      <AbilityTip ability={tip}>
        <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
          <SpellIcon ability={tip} size={40} />
        </span>
      </AbilityTip>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 text-[0.65rem] font-bold tracking-wider text-fg-faint uppercase">
          {slot}
          <span className="rounded bg-white/[0.06] px-1.5 py-px tracking-normal normal-case">{KIND_LABEL[kind]}</span>
          {flag && <span className={cn("rounded px-1.5 py-px tracking-normal normal-case", FLAG[flag][1])}>{FLAG[flag][0]}</span>}
          {it.r > 0 && <span className="tracking-normal normal-case">Req {it.r}</span>}
        </p>
        <AbilityTip ability={tip}>
          <a href={itemLink(id, flag)} target="_blank" rel="noreferrer" className="block truncate font-semibold hover:underline" style={{ color: QUALITY_COLOR[it.q] }}>
            {it.n}
          </a>
        </AbilityTip>
        <p className="truncate text-xs text-fg-soft">{src}</p>
      </div>
    </div>
  );
}

function Alt({ pick, slot, rank }: { pick: BisPick; slot: string; rank?: number }) {
  const [id, , flag] = pick;
  const it = BIS_ITEMS[id];
  const tip = tipFor(pick, slot);
  return (
    <AbilityTip ability={tip}>
      <a
        href={itemLink(id, flag)}
        target="_blank"
        rel="noreferrer"
        className="flex max-w-full items-center gap-1.5 rounded-md bg-white/[0.04] py-0.5 pr-2 pl-0.5 text-xs hover:bg-white/[0.08]"
      >
        <SpellIcon ability={tip} size={20} />
        {rank && <span className="text-fg-faint">#{rank}</span>}
        <span className="truncate" style={{ color: QUALITY_COLOR[it.q] }}>
          {it.n}
        </span>
      </a>
    </AbilityTip>
  );
}

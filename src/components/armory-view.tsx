import { useMemo, useState } from "react";
import { BisView } from "@/components/bis-view";
import { AbilityTip, CLASS_ICON, ClassIcon, SpellIcon } from "@/components/spell-icon";
import { FOREVER_SETS, QUALITY, QUALITY_COLOR, SETS, setClasses, WEAPONS, weaponClasses, type Armor, type GearSet } from "@/lib/armory";
import { classMeta, type ClassId } from "@/lib/macros";
import { RACES } from "@/lib/races";
import { cn } from "@/lib/utils";

type Kind = "all" | Armor | "weapons" | "shields";
const KINDS: [Kind, string][] = [
  ["all", "All sets"],
  ["cloth", "Cloth"],
  ["leather", "Leather"],
  ["mail", "Mail"],
  ["plate", "Plate"],
  ["weapons", "Weapons"],
  ["shields", "Shields and off-hands"],
];
const ALL_SETS = [...FOREVER_SETS, ...SETS];

/** Every Classic and WoW Forever gear set, epic weapon and shield, filtered by armor type, race and class. */
export function ArmoryView({ classId }: { classId: ClassId }) {
  const [kind, setKind] = useState<Kind>("all");
  const [raceId, setRaceId] = useState("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const race = RACES.find((r) => r.id === raceId);
  const meta = classMeta(classId);

  /** Usable by the picked class (if any) and by some class the picked race can be. */
  const usable = (classes: ClassId[], faction?: string | null) =>
    (!onlyMine || classes.includes(classId)) &&
    (!race || ((!faction || faction === race.faction) && classes.some((c) => race.classes.includes(c))));

  const groups = useMemo(() => {
    const out = new Map<string, GearSet[]>();
    if (kind === "weapons" || kind === "shields") return out;
    for (const s of ALL_SETS)
      if ((kind === "all" || s.armor === kind) && usable(setClasses(s), s.faction)) out.set(s.group, [...(out.get(s.group) ?? []), s]);
    return out;
  }, [kind, raceId, onlyMine, classId]);

  const weapons = useMemo(() => {
    const out = new Map<string, typeof WEAPONS>();
    if (kind !== "weapons" && kind !== "shields") return out;
    for (const w of WEAPONS) {
      const off = w.kind === "Shield" || w.kind === "Held in Off-hand";
      if (off === (kind === "shields") && usable(weaponClasses(w))) out.set(w.kind, [...(out.get(w.kind) ?? []), w]);
    }
    return out;
  }, [kind, raceId, onlyMine, classId]);

  const empty = groups.size === 0 && weapons.size === 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">Armory</h2>
        <p className="max-w-prose leading-relaxed text-fg-soft">
          Every Classic gear set from dungeon sets to Naxxramas, the PvP and crafted sets, every epic weapon and shield, plus
          WoW Forever's new Hyjal sets. Classic items come from Wowhead's Classic database. Pick a race below to see only
          what its classes can wear. Hover an icon for where it drops.
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Gear type">
          {KINDS.map(([id, label]) => (
            <button key={id} type="button" className="chip" aria-pressed={kind === id} onClick={() => setKind(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Race">
          <button type="button" className="chip" aria-pressed={raceId === "all"} onClick={() => setRaceId("all")}>
            All races
          </button>
          {RACES.map((r) => (
            <button
              key={r.id}
              type="button"
              className="chip inline-flex items-center gap-2 pl-1"
              aria-pressed={raceId === r.id}
              onClick={() => setRaceId(r.id)}
            >
              <SpellIcon ability={{ name: r.name, icon: r.icon, meta: "", desc: "" }} size={24} className="rounded-full" />
              {r.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip" aria-pressed={onlyMine} onClick={() => setOnlyMine(!onlyMine)}>
            Only {meta.label.toLowerCase()} gear
          </button>
        </div>
      </header>

      <BisView classId={classId} />

      {empty && (
        <p className="text-fg-soft">
          Nothing here fits that pick{race && onlyMine && !race.classes.includes(classId) ? `: a ${race.name} can't be a ${meta.label.toLowerCase()}` : ""}.
        </p>
      )}

      {[...groups].map(([group, sets]) => (
        <section key={group} className="flex flex-col gap-3">
          <h3 className="text-xs font-bold tracking-[0.18em] text-cls uppercase">
            {group} <span className="text-fg-faint">· {sets.length}</span>
          </h3>
          {sets[0].bonuses && (
            <p className="text-sm text-fg-faint">
              The pieces aren't in the game files yet, so only the datamined set bonuses are known. They may change before launch.
            </p>
          )}
          <ul className="grid gap-3 lg:grid-cols-2">
            {sets.map((s) => (
              <SetCard key={s.id} set={s} classId={classId} />
            ))}
          </ul>
        </section>
      ))}

      {[...weapons].map(([kindName, list]) => (
        <section key={kindName} className="flex flex-col gap-3">
          <h3 className="text-xs font-bold tracking-[0.18em] text-cls uppercase">
            {kindName === "Held in Off-hand" ? "Off-hand items" : kindName + "s"} <span className="text-fg-faint">· {list.length}</span>
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((w) => {
              const tip = { name: w.n, icon: w.i, meta: `${QUALITY[w.q]} · ${w.hand} ${w.kind}`, desc: w.src || "Classic" };
              return (
                <li key={w.n} className="flex items-center gap-3 rounded-lg bg-white/[0.035] p-2.5 shadow-[inset_0_0_0_1px_var(--color-line)]">
                  <AbilityTip ability={tip}>
                    <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
                      <SpellIcon ability={tip} size={40} />
                    </span>
                  </AbilityTip>
                  <div className="min-w-0">
                    <p className="truncate font-semibold" style={{ color: QUALITY_COLOR[w.q] }}>
                      {w.n}
                    </p>
                    <p className="truncate text-xs text-fg-faint">
                      {w.hand} · {w.src || "Classic"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function SetCard({ set: s, classId }: { set: GearSet; classId: ClassId }) {
  const src = s.items.find((i) => i.src)?.src;
  return (
    <li className="flex flex-col gap-3 rounded-lg bg-white/[0.035] p-4 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold" style={{ color: QUALITY_COLOR[s.items[0]?.q ?? 4] }}>
            {s.name}
          </p>
          <p className="text-xs font-semibold tracking-wider text-fg-faint uppercase">
            {[s.armor ?? "Accessories", s.faction, s.items.length ? `${s.items.length} pieces` : null].filter(Boolean).join(" · ")}
          </p>
        </div>
        {s.cls.length > 0 && (
          <div className="flex gap-1" aria-label="Classes">
            {s.cls.map((c) => {
              const Glyph = CLASS_ICON[c];
              return (
                <span
                  key={c}
                  title={classMeta(c).label}
                  className={cn(
                    "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-md ring-1 ring-line",
                    c === classId && "ring-2 ring-[var(--cls)]",
                  )}
                >
                  <ClassIcon id={c} size={32} fallback={<Glyph className="size-4" />} />
                  <span className="sr-only">{classMeta(c).label}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {s.items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {s.items.map((p) => {
            const tip = { name: p.n, icon: p.i, meta: [QUALITY[p.q], p.s, s.armor].filter(Boolean).join(" · "), desc: p.src || s.group };
            return (
              <AbilityTip key={p.n} ability={tip}>
                <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
                  <SpellIcon ability={tip} size={44} />
                </span>
              </AbilityTip>
            );
          })}
        </div>
      )}

      {s.bonuses && (
        <ul className="flex flex-col gap-1 text-sm text-fg-soft">
          {s.bonuses.map((b) => (
            <li key={b}>
              <span className="font-semibold text-glow">({b.split(":")[0]})</span>
              {b.slice(b.indexOf(":") + 1)}
            </li>
          ))}
        </ul>
      )}

      {src && <p className="text-xs text-fg-faint">{src}</p>}

      {s.id > 0 && (
        <div className="flex flex-wrap gap-2">
          <a className="btn-glass inline-flex h-9 items-center gap-2 rounded-md px-3 font-display text-sm font-bold" href={`https://www.wowhead.com/classic/item-set=${s.id}`} target="_blank" rel="noreferrer">
            View set in 3D on Wowhead
          </a>
        </div>
      )}
    </li>
  );
}

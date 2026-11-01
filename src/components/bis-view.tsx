import { useState } from "react";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { BIS, BIS_ITEMS, QUALITY, QUALITY_COLOR, type BisFlag } from "@/lib/armory";
import { classMeta, type ClassId } from "@/lib/macros";
import { cn } from "@/lib/utils";

const FOREVER_ERA = "https://theforeverera.com/en/bis/";
const itemLink = (id: number, flag: BisFlag) => `https://theforeverera.com/en/items/${flag === "New in Forever" ? `${id}/` : `#item-${id}`}`;
const FLAG_STYLE: Record<Exclude<BisFlag, "">, string> = {
  "New in Forever": "bg-emerald-400/15 text-emerald-300",
  Changed: "bg-sky-400/15 text-sky-300",
  "Not in beta client": "bg-amber-400/15 text-amber-300",
};
const FLAG_TIP: Record<Exclude<BisFlag, "">, string> = {
  "New in Forever": "A new WoW Forever item.",
  Changed: "Exists in Forever with different stats from Classic.",
  "Not in beta client": "Wasn't in the Forever beta client, so it may not be in the game.",
};

/** WoW Forever level 60 best-in-slot gear for each spec of the picked class, with where every piece comes from. */
export function BisView({ classId }: { classId: ClassId }) {
  const specs = BIS.find((b) => b.cls === classId)?.specs ?? [];
  const [pick, setPick] = useState({ classId, spec: 0 });
  const spec = specs[pick.classId === classId ? pick.spec : 0];
  if (!spec) return null;
  const missing = spec.list.filter(([, , , f]) => f === "Not in beta client").length;

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6" aria-label="Best in slot">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold text-fg">Best in slot · {classMeta(classId).label}</h3>
        <p className="max-w-prose text-sm text-fg-soft">
          WoW Forever level 60 lists from{" "}
          <a className="text-cls hover:underline" href={FOREVER_ERA} target="_blank" rel="noreferrer">
            The Forever Era
          </a>
          , built from the Forever beta client (Oct 25). The beta stopped at level 30, so these are forecasts, and most drop
          locations are still Classic data until Forever's raids are out. Items are tagged when they're new in Forever, changed
          from Classic, or missing from the beta client. Hover an item for details, or click its name for its Forever stats.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Spec">
        {specs.map((s, k) => (
          <button key={s.name} type="button" className="chip" aria-pressed={spec === s} onClick={() => setPick({ classId, spec: k })}>
            {s.name}
          </button>
        ))}
      </div>
      {missing > 0 && (
        <p className="text-xs text-fg-faint">
          {missing} of these {missing === 1 ? "piece wasn't" : "pieces weren't"} in the beta client, so {missing === 1 ? "it" : "they"} may be
          cut or replaced in Forever.
        </p>
      )}

      <ul className="grid gap-1.5 md:grid-cols-2">
        {spec.list.map(([slot, id, src, flag], k) => {
          const it = BIS_ITEMS[id];
          const tip = { name: it.n, icon: it.i, meta: [QUALITY[it.q], slot, flag].filter(Boolean).join(" · "), desc: [src, flag && FLAG_TIP[flag]].filter(Boolean).join(" ") };
          return (
            <li key={slot + k} className="flex items-center gap-3 rounded-lg bg-white/[0.035] p-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <AbilityTip ability={tip}>
                <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
                  <SpellIcon ability={tip} size={40} />
                </span>
              </AbilityTip>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[0.65rem] font-bold tracking-wider text-fg-faint uppercase">
                  {slot}
                  {flag && <span className={cn("rounded px-1.5 py-px tracking-normal normal-case", FLAG_STYLE[flag])}>{flag}</span>}
                </p>
                <AbilityTip ability={tip}>
                  <a href={itemLink(id, flag)} target="_blank" rel="noreferrer" className="block truncate font-semibold hover:underline" style={{ color: QUALITY_COLOR[it.q] }}>
                    {it.n}
                  </a>
                </AbilityTip>
                <p className="truncate text-xs text-fg-soft">{src}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

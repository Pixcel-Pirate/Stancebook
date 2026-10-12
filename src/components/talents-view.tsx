import { useState } from "react";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { classMeta, type ClassId } from "@/lib/macros";
import { TALENTS_SOURCE, treesFor, type Talent } from "@/lib/talents";
import { cn } from "@/lib/utils";

const asAbility = (t: Talent) => ({
  name: t.n,
  icon: t.i ?? "",
  meta: `${t.r} rank${t.r > 1 ? "s" : ""} · needs ${(t.t - 1) * 5} points${t.f ? " · Forever" : ""}`,
  desc: t.e,
});

/** The class's three talent trees, one row per tier, with a tooltip on every talent. */
export function TalentsView({ classId }: { classId: ClassId }) {
  const trees = treesFor(classId);
  const [pick, setPick] = useState(0);
  const meta = classMeta(classId);
  const tree = trees[pick];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-16">
      <header className="flex flex-col gap-3">
        <p className="font-display text-xs font-bold tracking-[0.25em] text-crimson uppercase">Talents</p>
        <h2 className="font-display text-3xl font-bold text-ink">{meta.label} talent trees</h2>
        <p className="max-w-prose leading-relaxed text-ink-soft">
          Every talent in the three trees, by the points you need to reach it. Gold-marked talents are new or changed in
          Forever. Hover an icon for its tooltip. Data from{" "}
          <a className="font-semibold text-crimson underline" href={TALENTS_SOURCE} target="_blank" rel="noreferrer">
            wowforevertalents.com
          </a>
          , refreshed with the weekly update.
        </p>
        <div className="flex flex-wrap gap-2">
          {trees.map((t, i) => (
            <button key={t.tree} type="button" aria-pressed={i === pick} onClick={() => setPick(i)} className="chip">
              {t.tree}
            </button>
          ))}
        </div>
      </header>

      {tree ? (
        <ol className="flex flex-col gap-3">
          {[...new Set(tree.talents.map((t) => t.t))].sort((a, b) => a - b).map((tier) => (
            <li key={tier} className="flex gap-4 rounded-lg bg-[#fff8e8]/35 p-3 shadow-[inset_0_0_0_1px_var(--color-ink-line)]">
              <span className="w-14 flex-none pt-2 text-center font-display text-sm font-bold text-ink-faint">
                {(tier - 1) * 5}
                <span className="block text-[0.7rem] font-semibold">points</span>
              </span>
              <ul className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tree.talents.filter((t) => t.t === tier).map((t) => (
                  <li key={t.n} className="flex gap-3">
                    <AbilityTip ability={asAbility(t)}>
                      <span tabIndex={0} className="relative block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-crimson">
                        <SpellIcon ability={asAbility(t)} size={46} glow={t.f} />
                        <span className="absolute -right-1.5 -bottom-1.5 rounded bg-[#120d09] px-1 font-mono text-[0.7rem] font-bold text-gold-hi">
                          {t.r}
                        </span>
                      </span>
                    </AbilityTip>
                    <div className="min-w-0">
                      <p className={cn("font-display font-bold leading-tight text-ink")}>{t.n}</p>
                      <p className="text-sm leading-snug text-ink-soft">{t.e}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-10 text-center text-ink-soft italic">Talent data for this class isn’t loaded yet.</p>
      )}
    </div>
  );
}

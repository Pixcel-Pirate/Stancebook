import { useState } from "react";
import { AbilityTip, CLASS_ICON, ClassIcon, SpellIcon } from "@/components/spell-icon";
import { findAbility } from "@/lib/abilities";
import { classMeta, type ClassId } from "@/lib/macros";
import { RACES } from "@/lib/races";
import { cn } from "@/lib/utils";

/** Every playable race with its racials; races that can be priests also show their two priest spells. */
export function RacesView({ classId }: { classId: ClassId }) {
  const meta = classMeta(classId);
  const [onlyMine, setOnlyMine] = useState(false);
  const shown = onlyMine ? RACES.filter((r) => r.classes.includes(classId)) : RACES;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">Races and racials</h2>
        <p className="max-w-prose leading-relaxed text-fg-soft">
          Every race in WoW Forever, including both Skyborne factions, with its racials as of the Oct 26 patch.
          Races that can be priests also list the two priest spells only they get. Hover an icon for its tooltip.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip" aria-pressed={!onlyMine} onClick={() => setOnlyMine(false)}>
            All races
          </button>
          <button type="button" className="chip" aria-pressed={onlyMine} onClick={() => setOnlyMine(true)}>
            Can be a {meta.label.toLowerCase()}
          </button>
        </div>
      </header>

      <ul className="grid gap-4 lg:grid-cols-2">
        {shown.map((r) => {
          const priest = r.priestSpells.map((n) => findAbility("priest", n)).filter((a) => a !== undefined);
          return (
            <li key={r.id} className="flex flex-col gap-4 rounded-lg bg-white/[0.035] p-5 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <div className="flex items-center gap-4">
                <SpellIcon ability={{ name: r.name, icon: r.icon, meta: "", desc: "" }} size={64} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-bold text-fg">{r.name}</h3>
                  <p className={cn("text-sm font-bold tracking-wider uppercase", r.faction === "Alliance" ? "text-sky-300" : "text-red-300")}>
                    {r.faction}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5" aria-label="Classes">
                {r.classes.map((c) => {
                  const Glyph = CLASS_ICON[c];
                  return (
                    <span
                      key={c}
                      title={classMeta(c).label}
                      className={cn(
                        "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-md ring-1 ring-line",
                        c === classId ? "ring-2 ring-[var(--cls)]" : "opacity-80",
                      )}
                    >
                      <ClassIcon id={c} size={32} fallback={<Glyph className="size-4" />} />
                      <span className="sr-only">{classMeta(c).label}</span>
                    </span>
                  );
                })}
              </div>

              <RacialList items={r.racials} />

              {priest.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold tracking-wider text-cls uppercase">As a priest</p>
                  <RacialList items={priest} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RacialList({ items }: { items: { name: string; icon: string; meta: string; desc: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((a) => (
        <li key={a.name} className="flex gap-3">
          <AbilityTip ability={a}>
            <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
              <SpellIcon ability={a} size={40} />
            </span>
          </AbilityTip>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-fg">{a.name}</p>
            <p className="text-xs font-semibold text-fg-faint">{a.meta}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-fg-soft">{a.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

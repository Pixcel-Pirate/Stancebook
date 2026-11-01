import { useState } from "react";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { BIS, BIS_ITEMS, PHASE_NAME, QUALITY, QUALITY_COLOR } from "@/lib/armory";
import { classMeta, type ClassId } from "@/lib/macros";
import { RACES } from "@/lib/races";

const wowheadItem = (id: number) => `https://www.wowhead.com/classic/item=${id}`;

/** Classic best-in-slot gear for each spec of the picked class, pre-raid or raid, with where every piece comes from. */
export function BisView({ classId }: { classId: ClassId }) {
  const specs = BIS.find((b) => b.cls === classId)?.specs ?? [];
  const races = RACES.filter((r) => r.classes.includes(classId) && specs[0]?.lists[r.id]);
  const [pick, setPick] = useState({ classId, spec: 0, race: races[0]?.id ?? "", tier: "pre" as "pre" | "end" });
  // Switching class resets the spec and race to ones that class has.
  const p = pick.classId === classId ? pick : { classId, spec: 0, race: races[0]?.id ?? "", tier: pick.tier };
  const spec = specs[p.spec];
  const list = spec?.lists[p.race]?.[p.tier] ?? [];
  if (!spec) return null;
  const top = Math.max(...list.map(([, id]) => BIS_ITEMS[id].p));

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6" aria-label="Best in slot">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold text-fg">Best in slot · {classMeta(classId).label}</h3>
        <p className="max-w-prose text-sm text-fg-soft">
          Classic BIS lists from the Best In Slot Classic addon, which collects them from Fight Club and the class Discords. They
          follow original Classic, so Forever's talent and item changes may shift a pick. Hover an item for where it drops, or
          click its name to open it on Wowhead.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Spec">
        {specs.map((s, k) => (
          <button key={s.name} type="button" className="chip" aria-pressed={p.spec === k} onClick={() => setPick({ ...p, spec: k })}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-2" role="group" aria-label="Gear stage">
          <button type="button" className="chip" aria-pressed={p.tier === "pre"} onClick={() => setPick({ ...p, tier: "pre" })}>
            Pre-raid
          </button>
          <button type="button" className="chip" aria-pressed={p.tier === "end"} onClick={() => setPick({ ...p, tier: "end" })}>
            Raid
          </button>
        </div>
        <span className="mx-1 h-5 w-px bg-line" aria-hidden />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Race">
          {races.map((r) => (
            <button
              key={r.id}
              type="button"
              className="chip inline-flex items-center gap-2 pl-1"
              aria-pressed={p.race === r.id}
              onClick={() => setPick({ ...p, race: r.id })}
            >
              <SpellIcon ability={{ name: r.name, icon: r.icon, meta: "", desc: "" }} size={24} className="rounded-full" />
              {r.name}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-fg-faint">
        {p.tier === "pre"
          ? "Dungeons, quests, crafting and world drops only, nothing from a raid."
          : `Best gear through ${PHASE_NAME[top] ?? "the last phase"}${top < 6 ? ". This spec's source list stops there" : ""}.`}{" "}
        Race only changes the weapon picks. Skyborne can use any race's list without the racial weapon bonuses.
      </p>

      <ul className="grid gap-1.5 md:grid-cols-2">
        {list.map(([slot, id], k) => {
          const it = BIS_ITEMS[id];
          const where = it.src === "Drop" ? "Drop (zone not listed)" : it.src || "Source not listed";
          const tip = { name: it.n, icon: it.i, meta: `${QUALITY[it.q]} · ${slot}`, desc: where };
          return (
            <li key={slot + k} className="flex items-center gap-3 rounded-lg bg-white/[0.035] p-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <AbilityTip ability={tip}>
                <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
                  <SpellIcon ability={tip} size={40} />
                </span>
              </AbilityTip>
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-bold tracking-wider text-fg-faint uppercase">{slot}</p>
                <AbilityTip ability={tip}>
                  <a href={wowheadItem(id)} target="_blank" rel="noreferrer" className="block truncate font-semibold hover:underline" style={{ color: QUALITY_COLOR[it.q] }}>
                    {it.n}
                  </a>
                </AbilityTip>
                <p className="truncate text-xs text-fg-soft">{where}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

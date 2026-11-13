import { useState } from "react";
import { SpellIcon } from "@/components/spell-icon";
import { classMeta, type ClassId, type Spec } from "@/lib/macros";
import { LEVELING_TIP, PROF_META, PROF_PICKS, type ProfId, type ProfPick } from "@/lib/profession-picks";

/** Recommended profession pairs for each spec of the picked class, each linking to its 1-300 guide below. */
export function ProfessionPicks({ classId, spec }: { classId: ClassId; spec: Spec | "all" }) {
  const picks = PROF_PICKS[classId];
  const specs = classMeta(classId).specs.filter((s) => s.id !== "all" && picks[s.id as Spec]);
  const [chosen, setChosen] = useState<Spec>(spec !== "all" && picks[spec] ? spec : (specs[0].id as Spec));
  const sp = picks[chosen] ?? picks[specs[0].id as Spec]!;

  return (
    <section className="mb-10 flex flex-col gap-4 rounded-xl bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6" aria-label="Recommended professions">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold text-fg">Recommended professions · {classMeta(classId).label}</h3>
        <p className="max-w-prose text-sm text-fg-soft">Pick your spec. Tap a profession to jump to its 1-300 guide.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Spec">
        {specs.map((s) => (
          <button key={s.id} type="button" className="chip" aria-pressed={s.id === chosen} onClick={() => setChosen(s.id as Spec)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <PickCard label="Best pick" pick={sp.best} />
        <PickCard label="Also good" pick={sp.alt} />
      </div>
      <p className="text-xs leading-relaxed text-fg-faint">{LEVELING_TIP}</p>
    </section>
  );
}

function PickCard({ label, pick }: { label: string; pick: ProfPick }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white/[0.035] p-4 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <p className="text-xs font-bold tracking-wider text-fg-faint uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">
        {pick.pair.map((p) => <ProfLink key={p} id={p} />)}
      </div>
      <p className="text-sm leading-relaxed text-fg-soft">{pick.why}</p>
    </div>
  );
}

function ProfLink({ id }: { id: ProfId }) {
  const m = PROF_META[id];
  return (
    <a
      href={`#prof-${id}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(`prof-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="flex min-h-11 items-center gap-2 rounded-md bg-inset py-1 pr-3 pl-1 font-semibold text-glow-hi hover:text-fg"
    >
      <SpellIcon ability={{ name: m.label, icon: m.icon, meta: "", desc: "" }} size={32} />
      {m.label}
    </a>
  );
}

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { abilitiesFor, spellsInLine } from "@/lib/abilities";
import { classMeta, macrosFor, type ClassId, type Macro } from "@/lib/macros";

/** One entry per ability the class's macros cast, with its tooltip and the macros that use it. */
export function AbilitiesView({
  classId,
  onOpenMacro,
}: {
  classId: ClassId;
  onOpenMacro: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const meta = classMeta(classId);

  const entries = useMemo(() => {
    const macros = macrosFor(classId);
    return abilitiesFor(classId)
      .map((a) => ({
        ability: a,
        usedIn: macros.filter((m: Macro) =>
          m.lines.some((l) => spellsInLine(l.code).some((n) => n.toLowerCase() === a.name.toLowerCase())),
        ),
      }))
      .sort((x, y) => x.ability.name.localeCompare(y.ability.name));
  }, [classId]);

  const needle = q.trim().toLowerCase();
  const shown = needle
    ? entries.filter(({ ability: a }) =>
        `${a.name} ${a.meta} ${a.desc}`.toLowerCase().includes(needle),
      )
    : entries;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">
          Every {meta.label.toLowerCase()} ability in the book
        </h2>
        <p className="max-w-prose leading-relaxed text-fg-soft">
          {entries.length} abilities used by the {meta.label.toLowerCase()} macros. Hover an icon
          for its in-game style tooltip, and click a macro to open it. Notes from the latest Forever
          patches are included where they changed the ability.
        </p>
        <label className="relative block max-w-md">
          <span className="sr-only">Search abilities</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-faint" />
          <input
            id="ability-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search abilities…"
            className="h-11 w-full rounded-md bg-white/[0.035] pr-3 pl-10 text-fg shadow-[inset_0_0_0_1px_var(--color-line)] outline-none placeholder:text-fg-faint focus:bg-white/[0.07]"
          />
        </label>
      </header>

      <ul className="grid gap-3 md:grid-cols-2">
        {shown.map(({ ability: a, usedIn }) => (
          <li
            key={a.name}
            className="flex gap-4 rounded-lg bg-white/[0.035] p-4 shadow-[inset_0_0_0_1px_var(--color-line)]"
          >
            <AbilityTip ability={a}>
              <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
                <SpellIcon ability={a} size={56} />
              </span>
            </AbilityTip>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold text-fg">{a.name}</h3>
              <p className="text-sm font-semibold text-fg-faint">{a.meta}</p>
              <p className="mt-1.5 leading-relaxed text-fg-soft">{a.desc}</p>
              {usedIn.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wider text-cls uppercase">Used in</span>
                  {usedIn.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onOpenMacro(m.id)}
                      className="chip h-7! px-2.5! text-xs!"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="py-10 text-center text-fg-soft italic">No ability matches “{q}”.</p>
      )}
    </div>
  );
}

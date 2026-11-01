import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { findAbility } from "@/lib/abilities";
import { KEYBIND_TIPS, KEYBINDS } from "@/lib/keybinds";
import { classMeta, type ClassId } from "@/lib/macros";

/** Suggested keybinds for the class, laid out the same way on every class so habits carry over. */
export function KeybindsView({ classId }: { classId: ClassId }) {
  const meta = classMeta(classId);
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">Suggested {meta.label.toLowerCase()} keybinds</h2>
        <p className="max-w-prose leading-relaxed text-fg-soft">
          A starting layout built around WASD. Every class uses the same plan, so the interrupt and the escape
          button sit on the same keys on all your characters. Move things around once it feels natural.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {KEYBIND_TIPS.map(([title, text]) => (
            <li key={title} className="rounded-lg bg-white/[0.035] p-3 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <p className="font-display font-bold text-fg">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-soft">{text}</p>
            </li>
          ))}
        </ul>
      </header>

      {KEYBINDS[classId].map((g) => (
        <section key={g.title} className="flex flex-col gap-3">
          <div>
            <h3 className="font-display text-sm font-bold tracking-widest text-cls uppercase">{g.title}</h3>
            <p className="text-sm text-fg-faint">{g.hint}</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.binds.map(([key, name, note]) => {
              const a = findAbility(classId, name);
              return (
                <li
                  key={key}
                  className="flex items-start gap-3 rounded-lg bg-white/[0.035] p-3 shadow-[inset_0_0_0_1px_var(--color-line)]"
                >
                  <kbd className="min-w-14 shrink-0 rounded-md bg-inset px-2 py-1.5 text-center font-mono text-sm font-semibold text-glow-hi ring-1 ring-line">
                    {key}
                  </kbd>
                  <AbilityTip ability={a}>
                    <span tabIndex={0} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]">
                      <SpellIcon ability={a} size={40} />
                    </span>
                  </AbilityTip>
                  <div className="min-w-0">
                    <p className="font-semibold text-fg">{name}</p>
                    {note && <p className="text-sm leading-snug text-fg-soft">{note}</p>}
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

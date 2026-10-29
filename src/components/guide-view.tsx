import { CopyButton } from "@/components/copy-button";
import { MacroCode } from "@/components/macro-code";
import { guideFor, HOW_TO_CREATE } from "@/lib/guide";
import type { ClassId } from "@/lib/macros";

export function HowItWorks({ classId }: { classId: ClassId }) {
  const guide = guideFor(classId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">
          {guide.heading}
        </h2>
        <p className="max-w-prose text-base leading-relaxed text-fg-soft">
          {guide.intro}
        </p>
      </header>

      <section
        id="create"
        className="scroll-mt-48 rounded-xl bg-white/[0.035] p-5 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6"
      >
        <h3 className="font-display text-xl font-bold text-fg">{HOW_TO_CREATE.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-soft">{HOW_TO_CREATE.body}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-4">
          {["Type /macro", "Click New", "Paste", "Drag to bar"].map((step, i) => (
            <li
              key={step}
              className="rounded-md bg-inset px-3 py-3 text-sm"
            >
              <span className="block font-display text-xs font-bold text-glow tabular-nums">
                {i + 1}
              </span>
              <span className="font-semibold text-glow-hi">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <nav
        aria-label="In this chapter"
        className="rounded-xl bg-white/[0.035] p-4 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-5"
      >
        <p className="text-xs font-medium tracking-wide text-fg-faint uppercase">
          In this chapter
        </p>
        <ol className="mt-1">
          <li>
            <a
              href="#create"
              className="flex min-h-11 items-center gap-3 text-sm text-fg-soft hover:text-fg"
            >
              <span className="w-5 font-mono text-xs text-fg-faint tabular-nums">1</span>
              Make a macro in-game
            </a>
          </li>
          {guide.sections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex min-h-11 items-center gap-3 text-sm text-fg-soft hover:text-fg"
              >
                <span className="w-5 font-mono text-xs text-fg-faint tabular-nums">
                  {i + 2}
                </span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {guide.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="flex scroll-mt-48 flex-col gap-3"
        >
          <h3 className="font-display text-xl font-bold text-fg">{section.title}</h3>
          <p className="text-sm leading-relaxed text-fg-soft sm:text-base">{section.body}</p>
          {section.bullets && (
            <dl className="divide-y divide-line rounded-lg bg-white/[0.035] shadow-[inset_0_0_0_1px_var(--color-line)]">
              {section.bullets.map((b) => (
                <div
                  key={b.term}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(8rem,14rem)_1fr] sm:gap-4"
                >
                  <dt className="font-mono text-sm font-medium text-cls">{b.term}</dt>
                  <dd className="text-sm leading-relaxed text-fg-soft">{b.meaning}</dd>
                </div>
              ))}
            </dl>
          )}
          {section.example && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium tracking-wide text-fg-faint uppercase">
                  {section.example.title}
                </p>
                <CopyButton text={section.example.code} size="icon-sm" label="Copy example" />
              </div>
              <MacroCode text={section.example.code} />
              <p className="text-sm text-fg-soft">{section.example.note}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export function ForeverView({ classId }: { classId: ClassId }) {
  const guide = guideFor(classId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">
          {guide.foreverHeading}
        </h2>
        <p className="max-w-prose text-base leading-relaxed text-fg-soft">
          {guide.foreverIntro}
        </p>
      </header>
      <ul className="flex flex-col gap-3">
        {guide.forever.map((note) => (
          <li
            key={note.title}
            className="rounded-xl bg-white/[0.035] p-5 shadow-[inset_0_0_0_1px_var(--color-line)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-fg">{note.title}</h3>
              <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-cls ring-1 ring-current/40">
                {note.tag}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-soft">{note.body}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-fg-faint">
        Unofficial companion for World of Warcraft: Forever. Spell names match
        the English game client so /cast works. Not affiliated with
        Blizzard Entertainment.
      </p>
    </div>
  );
}

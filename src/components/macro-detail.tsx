import { ArrowLeft, Bookmark, BookmarkCheck, Swords } from "lucide-react";
import { AbilityTip, primaryAbility, SpellIcon } from "@/components/spell-icon";
import { findAbility, spellsInLine, type Ability } from "@/lib/abilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { MacroCode } from "@/components/macro-code";
import { highlightLine } from "@/lib/highlight";
import {
  categoryLabel,
  classMeta,
  type Macro,
  macroText,
  SPEC_LABEL,
  type Spec,
} from "@/lib/macros";

export function MacroDetail({
  macro,
  saved,
  onToggleSave,
  onBack,
}: {
  macro: Macro;
  saved: boolean;
  onToggleSave: () => void;
  onBack?: () => void;
}) {
  const text = macroText(macro);
  const meta = classMeta(macro.classId);
  const specIds = meta.specs
    .map((s) => s.id)
    .filter((id): id is Spec => id !== "all");
  const abilities = [
    ...new Map(
      macro.lines
        .flatMap((l) => spellsInLine(l.code))
        .map((n) => findAbility(macro.classId, n))
        .filter((a): a is Ability => Boolean(a))
        .map((a) => [a.name, a] as const),
    ).values(),
  ];
  const everySpec = specIds.every((id) => macro.specs.includes(id));

  return (
    <article className="flex flex-col gap-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-1.5 self-start text-sm font-semibold text-fg-soft hover:text-fg lg:hidden"
        >
          <ArrowLeft className="size-4" /> All {meta.label} macros
        </button>
      )}

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{categoryLabel(macro.category)}</Badge>
          {macro.forever && <Badge tone="rust">Forever</Badge>}
          {macro.talent && <Badge tone="accent">Talent</Badge>}
          {everySpec ? (
            <Badge>All specs</Badge>
          ) : (
            macro.specs.map((s) => <Badge key={s}>{SPEC_LABEL[s]}</Badge>)
          )}
          <Badge>Lv {macro.level}+</Badge>
        </div>
        <div className="flex items-center gap-4">
          <AbilityTip ability={primaryAbility(macro)}>
            <SpellIcon macro={macro} size={64} glow />
          </AbilityTip>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{macro.name}</h2>
        </div>
        <p className="max-w-prose text-base leading-relaxed text-fg-soft">{macro.summary}</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={text} />
        <Button
          type="button"
          variant={saved ? "rust" : "outline"}
          onClick={onToggleSave}
          aria-pressed={saved}
        >
          {saved ? <BookmarkCheck strokeWidth={2} /> : <Bookmark strokeWidth={2} />}
          {saved ? "Saved" : "Save"}
        </Button>
        {macro.bind && (
          <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-fg-soft">
            Suggested bind
            <kbd className="min-w-10 rounded-md bg-inset px-3 py-1.5 text-center font-mono text-lg font-bold text-gold-hi shadow-[0_0_0_1px_var(--color-gold-lo)]">
              {macro.bind}
            </kbd>
          </span>
        )}
      </div>

      <MacroCode text={text} />

      {abilities.length > 0 && (
        <section>
          <h3 className="mb-3 font-display text-base font-bold text-white">
            Abilities used
          </h3>
          <ul className="flex flex-wrap gap-2">
            {abilities.map((a) => (
              <li key={a.name}>
                <AbilityTip ability={a}>
                  <span
                    tabIndex={0}
                    className="flex items-center gap-2 rounded-md bg-white/[0.035] py-1 pr-3 pl-1 shadow-[inset_0_0_0_1px_var(--color-line)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--cls)]"
                  >
                    <SpellIcon ability={a} size={34} />
                    <span className="font-semibold text-fg">{a.name}</span>
                  </span>
                </AbilityTip>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-fg-faint italic">Hover or tab to an ability to see its tooltip.</p>
        </section>
      )}

      <section>
        <h3 className="mb-3 font-display text-base font-bold text-white">
          Line by line
        </h3>
        <ol className="flex flex-col gap-2">
          {macro.lines.map((line, i) => {
            const code = line.code;
            return (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-b border-line py-3 last:border-0 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-4"
              >
                <span className="pt-1.5 font-mono text-sm font-medium text-cls tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <pre className="code-panel overflow-x-auto px-3 py-1.5 font-mono text-sm">
                    <code>{highlightLine(code)}</code>
                  </pre>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-soft">{line.why}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white/[0.035] p-4 shadow-[inset_0_0_0_1px_var(--color-line)]">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Swords className="size-3.5" strokeWidth={2} />
            How it works
          </h3>
          <p className="text-sm leading-relaxed text-fg">{macro.how}</p>
        </div>
        <div className="rounded-lg bg-white/[0.035] p-4 shadow-[inset_0_0_0_1px_var(--color-line)]">
          <h3 className="mb-2 font-semibold text-white">
            When to press it
          </h3>
          <p className="text-sm leading-relaxed text-fg">{macro.when}</p>
        </div>
      </section>

      {macro.caveats && macro.caveats.length > 0 && (
        <section className="rounded-lg bg-rust/8 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-rust)_35%,transparent)]">
          <h3 className="mb-2 font-semibold text-white">
            Watch out
          </h3>
          <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-fg">
            {macro.caveats.map((c) => (
              <li key={c} className="pl-4 -indent-4">
                — {c}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

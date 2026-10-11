import { ArrowLeft, Bookmark, BookmarkCheck, Swords } from "lucide-react";
import { SpellIcon } from "@/components/spell-icon";
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
import { localizeMacro, type ClientLang } from "@/lib/spells";

export function MacroDetail({
  macro,
  lang,
  saved,
  onToggleSave,
  onBack,
}: {
  macro: Macro;
  lang: ClientLang;
  saved: boolean;
  onToggleSave: () => void;
  onBack?: () => void;
}) {
  const text = localizeMacro(macroText(macro), lang);
  const meta = classMeta(macro.classId);
  const specIds = meta.specs
    .map((s) => s.id)
    .filter((id): id is Spec => id !== "all");
  const everySpec = specIds.every((id) => macro.specs.includes(id));

  return (
    <article className="flex flex-col gap-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-1.5 self-start text-sm font-semibold text-ink-soft hover:text-ink lg:hidden"
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
          <SpellIcon macro={macro} size={64} glow />
          <h2 className="font-display text-3xl font-bold text-ink">{macro.name}</h2>
        </div>
        <p className="max-w-prose text-base leading-relaxed text-ink-soft">{macro.summary}</p>
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
          <span className="ml-auto font-mono text-xs text-ink-faint">
            Suggested bind{" "}
            <kbd className="rounded bg-ink px-1.5 py-0.5 font-bold text-gold-hi">
              {macro.bind}
            </kbd>
          </span>
        )}
      </div>

      <MacroCode text={text} lang={lang} />

      <section>
        <h3 className="mb-3 font-display text-sm font-bold tracking-[0.18em] text-crimson uppercase">
          Line by line
        </h3>
        <ol className="flex flex-col gap-2">
          {macro.lines.map((line, i) => {
            const code = localizeMacro(line.code, lang);
            return (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-b border-ink-line py-3 last:border-0 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-4"
              >
                <span className="pt-1.5 font-display text-sm font-bold text-crimson tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <pre className="code-panel overflow-x-auto px-3 py-1.5 font-mono text-sm">
                    <code>{highlightLine(code)}</code>
                  </pre>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{line.why}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-[#fff8e8]/35 p-4 shadow-[inset_0_0_0_1px_var(--color-ink-line)]">
          <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-bold tracking-[0.12em] text-crimson uppercase">
            <Swords className="size-3.5" strokeWidth={2} />
            How it works
          </h3>
          <p className="text-sm leading-relaxed text-ink">{macro.how}</p>
        </div>
        <div className="rounded-lg bg-[#fff8e8]/35 p-4 shadow-[inset_0_0_0_1px_var(--color-ink-line)]">
          <h3 className="mb-2 font-display text-sm font-bold tracking-[0.12em] text-crimson uppercase">
            When to press it
          </h3>
          <p className="text-sm leading-relaxed text-ink">{macro.when}</p>
        </div>
      </section>

      {macro.caveats && macro.caveats.length > 0 && (
        <section className="rounded-lg bg-[#7c1d10]/10 p-4 shadow-[inset_0_0_0_1px_rgba(124,29,16,.3)]">
          <h3 className="mb-2 font-display text-sm font-bold tracking-[0.12em] text-crimson uppercase">
            Watch out
          </h3>
          <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink">
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

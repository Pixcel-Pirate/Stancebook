import { highlightLine } from "@/lib/highlight";
import { charCount, type ClientLang } from "@/lib/spells";
import { cn } from "@/lib/utils";

export function MacroCode({
  text,
  lang,
  className,
}: {
  text: string;
  lang: ClientLang;
  className?: string;
}) {
  const lines = text.split("\n");
  const n = charCount(text, lang);
  const over = n > 255;

  return (
    <div className={cn("code-panel overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-gold-lo/40 px-4 py-2">
        <span className="font-mono text-xs tracking-wide text-subtle uppercase">
          Macro · {lang === "fr" ? "French client" : "English client"}
        </span>
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            over ? "text-rust" : n > 200 ? "text-warn" : "text-muted",
          )}
        >
          {n}/255
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-4 shrink-0 select-none text-right text-subtle tabular-nums">
              {i + 1}
            </span>
            <code className="whitespace-pre">{highlightLine(line)}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

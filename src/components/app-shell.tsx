import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookOpen, Feather, ScrollText, Search, X } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { MacroDetail } from "@/components/macro-detail";
import { ForeverView, HowItWorks } from "@/components/guide-view";
import { Logo } from "@/components/logo";
import { CLASS_ICON, SpellIcon } from "@/components/spell-icon";
import { useFavorites } from "@/lib/favorites";
import { guideFor } from "@/lib/guide";
import {
  CATEGORIES,
  categoryLabel,
  CLASS_META,
  classMeta,
  findMacro,
  isClassId,
  MACROS,
  type Category,
  type ClassId,
  type Macro,
  macroText,
  type Spec,
} from "@/lib/macros";
import { localizeMacro, type ClientLang } from "@/lib/spells";
import { cn } from "@/lib/utils";

export type Tab = "macros" | "guide" | "forever";

type State = {
  tab: Tab;
  c: ClassId;
  spec: Spec | "all";
  cat: Category | "all";
  q: string;
  m?: string;
  lang: ClientLang;
};

const PREFS_KEY = "stancebook-prefs";

function loadPrefs(): Pick<State, "c" | "lang"> {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") as Partial<State>;
    return { c: isClassId(raw.c) ? raw.c : "warrior", lang: raw.lang === "fr" ? "fr" : "en" };
  } catch {
    return { c: "warrior", lang: "en" };
  }
}

const SEARCH_HINT: Record<ClassId, string> = {
  warrior: "Search Charge, Taunt, mouseover…",
  paladin: "Search Holy Strike, Cleanse, Judgement…",
  hunter: "Search Auto Shot, pet, Feign…",
  rogue: "Search Stealth, Kick, Sap…",
  priest: "Search Shield, Flash Heal, Fade…",
  shaman: "Search Earth Shock, totem, Riptide…",
  mage: "Search Counterspell, Blink, sheep…",
  warlock: "Search Shadow Bolt, Fear, pet…",
  druid: "Search Rejuvenation, Growl, Prowl…",
};

const EMPTY_HINT: Record<ClassId, string> = {
  warrior: "Nothing matches. Clear a filter or try “pummel”, “mouseover”, or “forever”.",
  paladin: "Nothing matches. Clear a filter or try “judgement”, “cleanse”, or “seal”.",
  hunter: "Nothing matches. Clear a filter or try “pet”, “sting”, or “feign”.",
  rogue: "Nothing matches. Clear a filter or try “stealth”, “kick”, or “sap”.",
  priest: "Nothing matches. Clear a filter or try “shield”, “fade”, or “shadow”.",
  shaman: "Nothing matches. Clear a filter or try “shock”, “totem”, or “heal”.",
  mage: "Nothing matches. Clear a filter or try “counterspell”, “blink”, or “frost”.",
  warlock: "Nothing matches. Clear a filter or try “pet”, “fear”, or “bane”.",
  druid: "Nothing matches. Clear a filter or try “rejuv”, “bear”, or “prowl”.",
};

const CLASS_COLOR: Record<ClassId, string> = {
  warrior: "var(--color-warrior)",
  paladin: "var(--color-paladin)",
  hunter: "var(--color-hunter)",
  rogue: "var(--color-rogue)",
  priest: "var(--color-priest)",
  shaman: "var(--color-shaman)",
  mage: "var(--color-mage)",
  warlock: "var(--color-warlock)",
  druid: "var(--color-druid)",
};

function matchesQuery(m: Macro, q: string): boolean {
  if (!q) return true;
  const hay = [
    m.name,
    m.summary,
    m.how,
    m.when,
    m.category,
    ...m.specs,
    ...m.lines.map((l) => l.code),
    m.forever ? "forever" : "",
    m.talent ? "talent" : "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function ClassCrest({ id, size = 40, on }: { id: ClassId; size?: number; on?: boolean }) {
  const Icon = CLASS_ICON[id];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        color: on ? "#1a0f06" : CLASS_COLOR[id],
        background: on
          ? `radial-gradient(circle at 35% 30%, #fff8, transparent 50%), ${CLASS_COLOR[id]}`
          : "radial-gradient(circle at 35% 30%, #4a311d, #160d07)",
        boxShadow: `0 0 0 1px #000, 0 0 0 2px ${on ? "var(--color-gold-hi)" : "var(--color-gold-lo)"}, 0 0 0 3px #000${on ? ", 0 0 16px rgba(247,220,140,.45)" : ""}`,
      }}
      aria-hidden
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.75} />
    </span>
  );
}

export function AppShell() {
  const [state, setState] = useState<State>(() => ({
    tab: "macros",
    spec: "all",
    cat: "all",
    q: "",
    ...loadPrefs(),
  }));
  const { has, toggle } = useFavorites();
  const [savedOnly, setSavedOnly] = useState(false);

  const { tab, c: classId, lang } = state;
  const meta = classMeta(classId);
  const spec = state.spec;
  const cat = state.cat;
  const q = state.q.trim().toLowerCase();
  const requested = findMacro(state.m);
  const selected = requested && requested.classId === classId ? requested : undefined;
  const catOptions = CATEGORIES.filter((c) => meta.categories.includes(c.id));
  const guide = guideFor(classId);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ c: classId, lang }));
    } catch {
      /* storage unavailable: prefs just won't persist */
    }
  }, [classId, lang]);

  function patch(p: Partial<State>) {
    setState((s) => ({ ...s, ...p }));
  }

  function pickClass(id: ClassId) {
    patch({ c: id, spec: "all", cat: "all", m: undefined, q: "" });
  }

  const filtered = useMemo(
    () =>
      MACROS.filter((m) => {
        if (m.classId !== classId) return false;
        if (spec !== "all" && !m.specs.includes(spec)) return false;
        if (cat !== "all" && m.category !== cat) return false;
        if (savedOnly && !has(m.id)) return false;
        return matchesQuery(m, q);
      }),
    [classId, spec, cat, q, savedOnly, has],
  );

  const starters = meta.starters
    .map((id) => findMacro(id))
    .filter((m): m is Macro => Boolean(m))
    .filter((m) => spec === "all" || m.specs.includes(spec));

  const bookCount = MACROS.filter((m) => m.classId === classId).length;

  const sections = useMemo(() => {
    const order = meta.categories.filter((id): id is Category => id !== "all");
    const buckets = new Map<Category, Macro[]>();
    for (const m of filtered) {
      const arr = buckets.get(m.category) ?? [];
      arr.push(m);
      buckets.set(m.category, arr);
    }
    return order
      .map((id) => ({ id, label: categoryLabel(id), items: buckets.get(id) ?? [] }))
      .filter((s) => s.items.length > 0);
  }, [filtered, meta.categories]);

  return (
    <div className="flex h-full flex-col">
      {/* Title bar */}
      <header className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 px-4 pt-3 pb-2 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo className="size-9 text-gold drop-shadow-[0_0_8px_rgba(214,170,78,.45)]" />
          <div>
            <p className="gold-text font-deco text-2xl leading-none font-bold tracking-wide">
              Stancebook
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-[0.25em] text-subtle uppercase">
              WoW Forever · Macro Skillbook
            </p>
          </div>
        </div>

        <nav className="order-3 flex gap-1 sm:order-none" aria-label="Sections">
          {(
            [
              ["macros", "Spellbook", BookOpen],
              ["guide", "How they work", Feather],
              ["forever", "Forever notes", ScrollText],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ tab: id })}
              aria-current={tab === id ? "page" : undefined}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-md px-4 font-display text-sm font-semibold tracking-wide transition-colors",
                tab === id
                  ? "btn-leather"
                  : "text-muted hover:text-gold-hi",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center rounded-md p-0.5 btn-leather">
          {(["en", "fr"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => patch({ lang: l })}
              aria-pressed={lang === l}
              className={cn(
                "h-8 min-w-10 rounded-sm px-2 text-xs font-bold tracking-wider uppercase transition-colors",
                lang === l ? "btn-gold" : "text-muted hover:text-gold-hi",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      {/* Class tabs, horizontal on small windows */}
      <nav
        className="flex shrink-0 gap-3 overflow-x-auto px-4 py-2 sm:px-6 lg:hidden"
        aria-label="Class"
      >
        {CLASS_META.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pickClass(c.id)}
            aria-pressed={classId === c.id}
            aria-label={c.label}
            title={c.label}
            className="p-1"
          >
            <ClassCrest id={c.id} size={38} on={classId === c.id} />
          </button>
        ))}
      </nav>

      <div className="flex min-h-0 flex-1 gap-0 px-3 pb-3 sm:px-6 lg:pr-0">
        <div className="book min-h-0 flex-1">
          {tab === "macros" ? (
            <div className="grid h-full min-h-0 gap-[3px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {/* Left page: the spell list */}
              <section
                className={cn(
                  "page page-left min-h-0 overflow-y-auto",
                  selected && "hidden lg:block",
                )}
              >
                <div key={classId} className="page-in flex flex-col gap-4 px-5 py-6 sm:px-8">
                  <header className="flex items-center gap-4">
                    <ClassCrest id={classId} size={52} on />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h1 className="font-display text-3xl font-bold text-crimson">
                          {meta.label}
                        </h1>
                        <span className="shrink-0 font-display text-sm text-ink-faint">
                          {bookCount} spells
                        </span>
                      </div>
                      <p className="text-sm text-ink-soft italic">{meta.hint}</p>
                    </div>
                  </header>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{guide.intro}</p>

                  <label className="relative block">
                    <span className="sr-only">Search macros</span>
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
                    <input
                      type="search"
                      value={state.q}
                      onChange={(e) => patch({ q: e.target.value })}
                      placeholder={SEARCH_HINT[classId]}
                      className="h-11 w-full rounded-md bg-[#fff8e8]/45 pr-10 pl-10 text-sm text-ink shadow-[inset_0_0_0_1px_var(--color-ink-line),inset_0_2px_4px_rgba(80,50,20,.12)] outline-none placeholder:text-ink-faint focus:bg-[#fff8e8]/70"
                    />
                    {state.q && (
                      <button
                        type="button"
                        className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-ink-faint hover:text-ink"
                        onClick={() => patch({ q: "" })}
                        aria-label="Clear search"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </label>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {meta.specs.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="chip"
                          aria-pressed={spec === s.id}
                          onClick={() => patch({ spec: s.id })}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {catOptions.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="chip"
                          aria-pressed={cat === c.id}
                          onClick={() => patch({ cat: c.id })}
                        >
                          {c.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="chip inline-flex items-center gap-1.5"
                        aria-pressed={savedOnly}
                        onClick={() => setSavedOnly((v) => !v)}
                      >
                        <Bookmark className="size-3.5" />
                        Saved
                      </button>
                    </div>
                  </div>

                  {filtered.length === 0 && (
                    <p className="py-10 text-center text-sm text-ink-soft italic">
                      {EMPTY_HINT[classId]}
                    </p>
                  )}

                  {sections.map((section) => (
                    <section key={section.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 pt-2">
                        <h2 className="font-display text-sm font-bold tracking-[0.18em] text-crimson uppercase">
                          {section.label}
                        </h2>
                        <div className="rule-ornate flex-1" />
                      </div>
                      <ul className="grid gap-x-4 gap-y-1 xl:grid-cols-2">
                        {section.items.map((m) => {
                          const text = localizeMacro(macroText(m), lang);
                          const active = selected?.id === m.id;
                          return (
                            <li key={m.id} className="group relative">
                              <button
                                type="button"
                                onClick={() => patch({ m: m.id })}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-md p-2 pr-12 text-left transition-colors",
                                  active ? "bg-[#7c1d10]/12" : "hover:bg-[#5c442b]/10",
                                )}
                              >
                                <SpellIcon macro={m} size={46} glow={active} />
                                <span className="min-w-0">
                                  <span className="block truncate font-semibold text-ink">
                                    {m.name}
                                  </span>
                                  <span className="block truncate text-xs text-ink-faint">
                                    Lv {m.level}
                                    {m.bind && <> · Bind {m.bind}</>}
                                    {m.forever && (
                                      <span className="font-semibold text-crimson"> · Forever</span>
                                    )}
                                    {m.talent && <span className="text-ink-soft"> · Talent</span>}
                                    <span className={text.length > 255 ? "text-crimson" : ""}>
                                      {" "}· {text.length}/255
                                    </span>
                                  </span>
                                </span>
                              </button>
                              <CopyButton
                                text={text}
                                size="icon-sm"
                                variant="ghost"
                                className="absolute top-1/2 right-1.5 -translate-y-1/2 opacity-70 group-hover:opacity-100 focus-visible:opacity-100"
                                label={`Copy ${m.name}`}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              </section>

              {/* Right page: detail, or the Forever primer */}
              <section
                className={cn(
                  "page page-right min-h-0 overflow-y-auto",
                  !selected && "hidden lg:block",
                )}
              >
                <div key={selected?.id ?? classId} className="page-in px-5 py-6 sm:px-8">
                  {selected ? (
                    <MacroDetail
                      macro={selected}
                      lang={lang}
                      saved={has(selected.id)}
                      onToggleSave={() => toggle(selected.id)}
                      onBack={() => patch({ m: undefined })}
                    />
                  ) : (
                    <aside className="flex flex-col gap-4">
                      <p className="font-display text-xs font-bold tracking-[0.25em] text-crimson uppercase">
                        Forever
                      </p>
                      <h2 className="-mt-2 font-display text-2xl font-bold text-ink">
                        {guide.foreverHeading}
                      </h2>
                      <p className="text-[15px] leading-relaxed text-ink-soft">
                        {guide.foreverIntro}
                      </p>
                      <div className="rule-ornate" />
                      <ul className="flex flex-col gap-4">
                        {guide.forever.slice(0, 4).map((note) => (
                          <li key={note.title}>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="font-display font-bold text-ink">{note.title}</h3>
                              <span className="text-[11px] font-bold tracking-wider text-crimson uppercase">
                                {note.tag}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                              {note.body}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm text-ink-faint italic">
                        Pick any spell on the left to read it line by line and copy it for /macro.
                      </p>
                    </aside>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <section className="page h-full min-h-0 overflow-y-auto rounded-md">
              <div key={tab + classId} className="page-in px-5 py-8 sm:px-10">
                {tab === "guide" ? (
                  <HowItWorks lang={lang} classId={classId} />
                ) : (
                  <ForeverView classId={classId} />
                )}
              </div>
            </section>
          )}
        </div>

        {/* Side bookmark tabs, like the in-game spellbook */}
        <nav className="hidden w-16 shrink-0 flex-col gap-2 pt-8 lg:flex" aria-label="Class">
          {CLASS_META.map((c) => {
            const on = classId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pickClass(c.id)}
                aria-pressed={on}
                title={c.label}
                className={cn(
                  "group relative flex h-14 items-center rounded-r-lg pl-2 transition-[width,background] duration-200",
                  on
                    ? "w-16 bg-gradient-to-r from-leather to-leather-hi shadow-[inset_0_0_0_1px_var(--color-gold-lo)]"
                    : "w-13 bg-gradient-to-r from-[#140c07] to-leather hover:w-16",
                )}
              >
                <ClassCrest id={c.id} size={38} on={on} />
                <span className="pointer-events-none absolute left-full ml-2 rounded bg-black/85 px-2 py-1 font-display text-xs whitespace-nowrap text-gold-hi opacity-0 shadow-lg ring-1 ring-gold-lo transition-opacity group-hover:opacity-100">
                  {c.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Action bar: the suggested binds */}
      {tab === "macros" && starters.length > 0 && (
        <footer className="flex shrink-0 items-center justify-center gap-4 border-t border-gold-lo/40 bg-gradient-to-b from-[#1b120b] to-[#0b0806] px-4 py-2.5">
          <span className="hidden font-display text-xs font-semibold tracking-[0.2em] text-subtle uppercase md:block">
            Bind these first
          </span>
          <ul className="flex gap-2 overflow-x-auto p-1">
            {starters.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => patch({ m: m.id })}
                  title={m.name}
                  aria-label={m.name}
                  className="relative block transition-transform hover:-translate-y-0.5"
                >
                  <SpellIcon macro={m} size={44} glow={selected?.id === m.id} />
                  {m.bind && (
                    <span className="absolute top-0.5 right-1 font-mono text-[10px] font-bold text-white [text-shadow:0_1px_2px_#000,0_0_3px_#000]">
                      {m.bind.replace(/Shift\+/i, "s-").replace(/Ctrl\+/i, "c-").replace(/Alt\+/i, "a-")}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </div>
  );
}

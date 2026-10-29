import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookOpen, ChevronDown, Feather, Network, ScrollText, Search, Sparkles, Users, X } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { MacroDetail } from "@/components/macro-detail";
import { ForeverView, HowItWorks } from "@/components/guide-view";
import { Logo } from "@/components/logo";
import { AbilitiesView } from "@/components/abilities-view";
import { TalentsView } from "@/components/talents-view";
import { RacesView } from "@/components/races-view";
import { UpdateButton } from "@/components/update-button";
import { ActionBar, dragMacro } from "@/components/action-bar";
import { AbilityTip, CLASS_ICON, ClassIcon, primaryAbility, SpellIcon } from "@/components/spell-icon";
import { useFavorites } from "@/lib/favorites";
import { guideFor, LATEST_PATCH, latestPatchNotes } from "@/lib/guide";
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
import { cn, useStored } from "@/lib/utils";

export type Tab = "macros" | "abilities" | "talents" | "races" | "guide" | "forever";

type State = {
  tab: Tab;
  c: ClassId;
  spec: Spec | "all";
  cat: Category | "all";
  q: string;
  m?: string;
};

const PREFS_KEY = "stancebook-prefs";

function loadPrefs(): Pick<State, "c"> {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") as Partial<State>;
    return { c: isClassId(raw.c) ? raw.c : "warrior" };
  } catch {
    return { c: "warrior" };
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

// Hex values for --cls (a registered <color>, so it must be a literal, not var()).
const CLASS_COLOR: Record<ClassId, string> = {
  warrior: "#c69b6d",
  paladin: "#f48cba",
  hunter: "#aad372",
  rogue: "#fff468",
  priest: "#f0ebe0",
  shaman: "#2a8cff",
  mage: "#3fc7eb",
  warlock: "#8788ee",
  druid: "#ff7c0a",
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
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-[30%] transition-[filter,box-shadow] duration-300 ease-out"
      style={{
        width: size,
        height: size,
        color: CLASS_COLOR[id],
        background: "radial-gradient(circle at 35% 30%, #20253a, #07080d)",
        boxShadow: on
          ? `0 0 0 1px #000, 0 0 0 2px ${CLASS_COLOR[id]}, 0 0 22px -2px ${CLASS_COLOR[id]}`
          : "0 0 0 1px #000, 0 0 0 2px rgba(190,210,255,.12)",
        filter: on ? undefined : "saturate(.55) brightness(.8)",
      }}
      aria-hidden
    >
      <ClassIcon id={id} size={size} fallback={<Icon size={Math.round(size * 0.5)} strokeWidth={1.75} />} />
    </span>
  );
}

const isText = (v: unknown): v is string => typeof v === "string";

/** Brief "what changed for my class" from the newest patch. Closing it sticks until the next patch lands. */
function PatchStrip({ classId, onOpenNotes }: { classId: ClassId; onOpenNotes: () => void }) {
  const [closedFor, setClosedFor] = useStored("stancebook-patch-closed", () => "", isText);
  if (!LATEST_PATCH) return null;
  const notes = latestPatchNotes(classId);
  const open = closedFor !== LATEST_PATCH;
  const label = classMeta(classId).label;
  return (
    <section
      aria-label={`${LATEST_PATCH} changes for ${label}`}
      className="patch-strip shrink-0 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 sm:px-5"
    >
      <div className="flex items-center gap-2.5">
        <ScrollText className="size-4 shrink-0 text-cls" />
        <p className="min-w-0 truncate text-sm font-semibold text-fg">
          <span className="font-display text-glow-hi">{LATEST_PATCH}</span>
          <span className="text-fg-faint"> · </span>
          <span className="text-cls">{label}</span>
          <span className="font-normal text-fg-soft">
            {notes.length ? ` · ${notes.length} ${notes.length === 1 ? "change" : "changes"}` : " · no changes this patch"}
          </span>
        </p>
        <button type="button" onClick={onOpenNotes} className="ml-auto shrink-0 text-sm font-semibold text-fg-soft hover:text-fg">
          All notes
        </button>
        {notes.length > 0 && (
          <button
            type="button"
            onClick={() => setClosedFor(open ? LATEST_PATCH : "")}
            aria-expanded={open}
            aria-label={open ? "Hide patch changes" : "Show patch changes"}
            className="grid size-8 shrink-0 place-items-center rounded-md text-fg-soft hover:bg-white/5 hover:text-fg"
          >
            <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
          </button>
        )}
      </div>
      {open && notes.length > 0 && (
        <ul key={classId} className="stagger mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((n) => (
            <li key={n.title} className="rounded-xl bg-white/[0.04] px-3 py-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
              <p className="text-sm font-semibold text-fg">{n.title}</p>
              <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-fg-soft">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const TABS = [
  ["macros", "Spellbook", BookOpen],
  ["abilities", "Abilities", Sparkles],
  ["talents", "Talents", Network],
  ["races", "Races", Users],
  ["guide", "How they work", Feather],
  ["forever", "Forever notes", ScrollText],
] as const;

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

  const { tab, c: classId } = state;
  const meta = classMeta(classId);
  const spec = state.spec;
  const cat = state.cat;
  const q = state.q.trim().toLowerCase();
  const requested = findMacro(state.m);
  const selected = requested && requested.classId === classId ? requested : undefined;
  const catOptions = CATEGORIES.filter((c) => meta.categories.includes(c.id));
  const guide = guideFor(classId);

  // Dye the whole book in the class color; html transitions --cls so the change fades in.
  useEffect(() => {
    document.documentElement.style.setProperty("--cls", CLASS_COLOR[classId]);
  }, [classId]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ c: classId }));
    } catch {
      /* storage unavailable: prefs just won't persist */
    }
  }, [classId]);

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
      <PatchStrip classId={classId} onOpenNotes={() => patch({ tab: "forever" })} />
      <div className="flex min-h-0 flex-1">
        {/* Class rail, like the bookmark tabs down the side of the in-game spellbook */}
        <nav
          className="relative z-[1] hidden w-[4.75rem] shrink-0 flex-col items-center gap-1.5 bg-white/[0.02] py-4 shadow-[inset_-1px_0_0_var(--color-line)] backdrop-blur-xl lg:flex"
          aria-label="Class"
        >
          <Logo className="mb-3 size-9 text-glow-hi drop-shadow-[0_0_8px_var(--cls)]" />
          {CLASS_META.map((c) => {
            const on = classId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pickClass(c.id)}
                aria-pressed={on}
                aria-label={c.label}
                className="group relative grid h-14 w-full place-items-center"
              >
                <span
                  className={cn(
                    "absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-cls shadow-[0_0_10px_var(--cls)] transition-[opacity,scale] duration-300 ease-out",
                    on ? "opacity-100" : "scale-y-0 opacity-0",
                  )}
                />
                <span className="transition-transform duration-150 ease-out group-active:scale-95">
                  <ClassCrest id={c.id} size={42} on={on} />
                </span>
                <span className="pointer-events-none absolute left-full z-20 ml-1 rounded-md bg-[#101326] px-2.5 py-1 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-lg ring-1 ring-[#8f8f9a] transition-opacity group-hover:opacity-100">
                  {c.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Class banner */}
          <header className="shrink-0 px-3 pt-3 sm:px-5">
            <div className="banner">
              <span key={classId} className="sweep" aria-hidden />
              <ClassIcon id={classId} size={240} fallback={null} imgClassName="banner-art" />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 pt-4 sm:px-6 sm:pt-5">
                <ClassCrest id={classId} size={56} on />
                <div key={classId} className="dye-in min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h1 className="font-display text-3xl leading-tight font-bold tracking-[0.01em] text-white uppercase sm:text-4xl">{meta.label}</h1>
                    <span className="text-sm font-semibold text-fg-soft tabular-nums">{bookCount} macros</span>
                  </div>
                  <p className="text-sm text-fg-soft">{meta.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <UpdateButton />
                  <p className="hidden text-right leading-tight sm:block">
                    <span className="block font-display text-base font-semibold tracking-[0.24em] text-glow-hi uppercase">Stancebook</span>
                    <span className="block text-xs tracking-[0.04em] text-fg-soft">WoW Forever macros</span>
                  </p>
                </div>
              </div>

              {/* Class picker on narrow windows */}
              <nav className="flex gap-2 overflow-x-auto px-4 pt-4 sm:px-6 lg:hidden" aria-label="Class">
                {CLASS_META.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickClass(c.id)}
                    aria-pressed={classId === c.id}
                    aria-label={c.label}
                    className="shrink-0 p-1 transition-transform duration-150 ease-out active:scale-95"
                  >
                    <ClassCrest id={c.id} size={38} on={classId === c.id} />
                  </button>
                ))}
              </nav>

              <nav className="mt-2 flex overflow-x-auto px-2 sm:px-4" aria-label="Sections">
                {TABS.map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => patch({ tab: id })}
                    aria-current={tab === id ? "page" : undefined}
                    className="tab"
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </header>

          <main className="book flex min-h-0 flex-1 flex-col p-3 sm:px-5">
            {tab === "macros" ? (
              <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                {/* Spell list */}
                <section className={cn("page min-h-0 overflow-y-auto", selected && "hidden lg:block")}>
                  <div key={classId} className="page-in flex flex-col gap-4 px-4 py-5 sm:px-6">
                    <p className="max-w-prose text-[15px] leading-relaxed text-fg-soft">{guide.intro}</p>

                    <label className="relative block">
                      <span className="sr-only">Search macros</span>
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-faint" />
                      <input
                        type="search"
                        enterKeyHint="search"
                        value={state.q}
                        onChange={(e) => patch({ q: e.target.value })}
                        placeholder={SEARCH_HINT[classId]}
                        className="h-11 w-full rounded-xl bg-inset pr-10 pl-10 text-fg shadow-[inset_0_0_0_1px_var(--color-line)] outline-none transition-shadow duration-200 placeholder:text-fg-faint focus:shadow-[inset_0_0_0_1px_var(--cls),0_0_20px_-8px_var(--cls)]"
                      />
                      {state.q && (
                        <button
                          type="button"
                          className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-fg-faint hover:text-fg"
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
                      <p className="py-10 text-center text-sm text-fg-soft">{EMPTY_HINT[classId]}</p>
                    )}

                    {sections.map((section) => (
                      <section key={section.id} className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 pt-3">
                          <h2 className="font-display text-sm font-semibold tracking-[0.14em] text-white uppercase">{section.label}</h2>
                          <span className="text-xs text-fg-faint tabular-nums">{section.items.length}</span>
                          <div className="rule-ornate flex-1" />
                        </div>
                        <ul className="stagger grid gap-1 xl:grid-cols-2">
                          {section.items.map((m) => {
                            const text = macroText(m);
                            const active = selected?.id === m.id;
                            return (
                              <li key={m.id} className="group relative">
                                <button
                                  type="button"
                                  draggable
                                  onDragStart={(e) => dragMacro(e, m.id)}
                                  onClick={() => patch({ m: m.id })}
                                  aria-current={active || undefined}
                                  className="spell-row flex w-full items-center gap-3 rounded-xl p-2 pr-12 text-left"
                                >
                                  <AbilityTip ability={primaryAbility(m)}>
                                    <SpellIcon macro={m} size={46} glow={active} />
                                  </AbilityTip>
                                  <span className="min-w-0">
                                    <span className="block truncate font-semibold text-fg">{m.name}</span>
                                    <span className="block truncate text-xs text-fg-faint">
                                      Lv {m.level}
                                      {m.bind && (
                                        <>
                                          {" · "}
                                          <kbd className="rounded bg-inset px-1.5 py-px font-mono text-[0.8rem] font-bold text-glow-hi ring-1 ring-line">
                                            {m.bind}
                                          </kbd>
                                        </>
                                      )}
                                      {m.forever && <span className="font-semibold text-cls"> · Forever</span>}
                                      {m.talent && <span className="text-fg-soft"> · Talent</span>}
                                      <span className={cn("tabular-nums", text.length > 255 && "text-rust")}>
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

                {/* Detail, or the Forever primer */}
                <section className={cn("page min-h-0 overflow-y-auto", !selected && "hidden lg:block")}>
                  <div key={selected?.id ?? classId} className="page-in px-4 py-5 sm:px-7">
                    {selected ? (
                      <MacroDetail
                        macro={selected}
                        saved={has(selected.id)}
                        onToggleSave={() => toggle(selected.id)}
                        onBack={() => patch({ m: undefined })}
                      />
                    ) : (
                      <aside className="flex flex-col gap-4">
                        <h2 className="font-display text-2xl font-bold text-white">{guide.foreverHeading}</h2>
                        <p className="max-w-prose text-[15px] leading-relaxed text-fg-soft">{guide.foreverIntro}</p>
                        <div className="rule-ornate" />
                        <ul className="stagger flex flex-col gap-5">
                          {guide.forever.slice(0, 4).map((note) => (
                            <li key={note.title}>
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="font-semibold text-fg">{note.title}</h3>
                                <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-cls ring-1 ring-current/40">
                                  {note.tag}
                                </span>
                              </div>
                              <p className="mt-1 max-w-prose text-sm leading-relaxed text-fg-soft">{note.body}</p>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-sm text-fg-faint">
                          Pick any macro on the left to read it line by line and copy it for /macro.
                        </p>
                      </aside>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <section className="page h-full min-h-0 overflow-y-auto">
                <div key={tab + classId} className="page-in px-4 py-7 sm:px-10">
                  {tab === "abilities" ? (
                    <AbilitiesView classId={classId} onOpenMacro={(id) => patch({ tab: "macros", m: id })} />
                  ) : tab === "talents" ? (
                    <TalentsView classId={classId} />
                  ) : tab === "races" ? (
                    <RacesView classId={classId} />
                  ) : tab === "guide" ? (
                    <HowItWorks classId={classId} />
                  ) : (
                    <ForeverView classId={classId} />
                  )}
                </div>
              </section>
            )}
          </main>

          {/* Action bar: drag macros in */}
          {tab === "macros" && (
            <ActionBar classId={classId} starters={starters} selectedId={selected?.id} onOpen={(id) => patch({ m: id })} />
          )}
        </div>
      </div>
    </div>
  );
}

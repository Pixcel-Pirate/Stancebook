import { ICON_CDN } from "@/lib/abilities";
import { materialTotals, PROFESSIONS, type ProfessionGuide } from "@/lib/professions";

const card = "rounded-lg bg-white/[0.035] p-3 shadow-[inset_0_0_0_1px_var(--color-line)]";

function Icon({ icon, size }: { icon: string; size: number }) {
  return (
    <img
      src={ICON_CDN + icon + ".jpg"}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className="shrink-0 rounded-md ring-1 ring-line"
    />
  );
}

const item = (id?: number) => (id ? `https://www.wowhead.com/forever/item=${id}` : undefined);

function Guide({ g }: { g: ProfessionGuide }) {
  const totals = materialTotals(g);
  const crafts = g.steps.reduce((n, s) => n + (s.count ?? 0), 0);
  return (
    <section id={`prof-${g.id}`} className="flex scroll-mt-4 flex-col gap-6">
      <header className="flex items-start gap-4">
        <Icon icon={g.icon} size={56} />
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-bold text-fg">{g.name} 1-300</h3>
          <p className="max-w-prose leading-relaxed text-fg-soft">{g.summary}</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <h4 className="font-display text-sm font-bold tracking-widest text-cls uppercase">Where to train</h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {g.trainers.map((t) => (
            <li key={t.rank} className={card}>
              <p className="font-display font-bold text-fg">
                {t.rank} <span className="text-sm font-semibold text-fg-faint">at skill {t.skill}{t.level ? `, level ${t.level}` : ""}</span>
              </p>
              {t.where && <p className="mt-1 text-sm leading-relaxed text-fg-soft">{t.where}</p>}
            </li>
          ))}
        </ul>
      </div>

      {totals.length > 0 && (
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="font-display text-sm font-bold tracking-widest text-cls uppercase">Shopping list</h4>
            <p className="text-sm text-fg-faint">
              Everything for all {crafts} crafts, added up from each recipe. Stones and parts the route makes itself are already counted in.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {totals.map((t) => (
              <li key={t.name} className={`${card} flex items-center gap-3`}>
                <Icon icon={t.icon} size={36} />
                <a href={item(t.id)} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate font-semibold text-fg hover:text-glow-hi">
                  {t.name}
                </a>
                <span className="font-mono text-lg font-semibold text-glow-hi tabular-nums">{t.qty}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h4 className="font-display text-sm font-bold tracking-widest text-cls uppercase">Step by step</h4>
        <ol className="flex flex-col gap-2">
          {g.steps.map((s) => (
            <li key={`${s.from}-${s.title}`} className={`${card} flex items-start gap-3`}>
              <span className="w-20 shrink-0 pt-1 font-mono text-sm font-semibold text-glow-hi tabular-nums">
                {s.from}-{s.to}
              </span>
              <Icon icon={s.icon} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-fg">
                  {s.count ? `${s.count}x ` : ""}
                  <a href={item(s.id)} target="_blank" rel="noreferrer" className="hover:text-glow-hi">{s.title}</a>
                </p>
                {s.mats && s.mats.length > 0 && (
                  <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-soft">
                    {s.mats.map((m) => (
                      <li key={m.name} className="flex items-center gap-1.5">
                        <Icon icon={m.icon} size={18} />
                        <span className="tabular-nums">{m.qty * (s.count ?? 1)}</span> {m.name}
                        {s.count && s.count > 1 ? <span className="text-fg-faint">({m.qty} each)</span> : null}
                      </li>
                    ))}
                  </ul>
                )}
                {s.where && <p className="mt-1 text-sm text-fg-soft">{s.where}</p>}
                {s.note && <p className="mt-1 text-sm text-fg-faint">{s.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {g.tips && (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-fg-soft">
          {g.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Profession leveling guides, 1-300, with material totals computed from the recipes. */
export function ProfessionsView() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">Profession progression</h2>
        {PROFESSIONS.length > 1 && (
          <nav className="flex flex-wrap gap-2" aria-label="Professions">
            {PROFESSIONS.map((g) => (
              <a key={g.id} href={`#prof-${g.id}`} className="btn-glass inline-flex h-9 items-center gap-2 rounded-md px-3 font-display text-sm font-bold">
                <Icon icon={g.icon} size={20} />
                {g.name}
              </a>
            ))}
          </nav>
        )}
      </header>
      {PROFESSIONS.map((g) => (
        <Guide key={g.id} g={g} />
      ))}
    </div>
  );
}

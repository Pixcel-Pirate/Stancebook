import { RotateCcw } from "lucide-react";
import { AbilityTip, SpellIcon } from "@/components/spell-icon";
import { classMeta, type ClassId } from "@/lib/macros";
import { canAdd, canRemove, change, grandTotal, MAX_POINTS, treeTotal, type Spent } from "@/lib/talent-rules";
import { TALENTS_SOURCE, treesFor, type Talent } from "@/lib/talents";
import { cn, useStored } from "@/lib/utils";

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isSpent = (v: unknown): v is Spent =>
  isObj(v) &&
  Object.entries(v).every(
    ([k, tree]) => ["0", "1", "2"].includes(k) && isObj(tree) && Object.values(tree).every((r) => Number.isInteger(r) && (r as number) >= 0 && (r as number) <= 5),
  );

/** Talent calculator: click to add a point, right-click (or Shift+click) to take one back. 51 points = level 60. */
export function TalentsView({ classId }: { classId: ClassId }) {
  const trees = treesFor(classId);
  const meta = classMeta(classId);
  const [saved, setSpent] = useStored(`stancebook-talents-${classId}`, (): Spent => ({}), isSpent);
  // patches remove talents and lower ranks; drop or clamp those so old builds still add up
  const spent: Spent = Object.fromEntries(
    Object.entries(saved).map(([k, tree]) => [
      k,
      Object.fromEntries(
        Object.entries(tree).flatMap(([n, r]) => {
          const t = trees[+k]?.talents.find((x) => x.n === n);
          return t ? [[n, Math.min(r, t.r)]] : [];
        }),
      ),
    ]),
  );
  const total = grandTotal(spent);

  function click(tree: number, t: Talent, remove: boolean) {
    if (remove ? canRemove(trees, spent, tree, t) : canAdd(trees, spent, tree, t))
      setSpent(change(spent, tree, t, remove ? -1 : 1));
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-16">
      <header className="flex flex-col gap-3">
        <h2 className="font-display text-3xl font-bold text-fg">{meta.label} talent calculator</h2>
        <p className="max-w-prose leading-relaxed text-fg-soft">
          Click a talent to spend a point, right-click to take it back. Every 5 points in a tree opens the next row.
          Gold-marked talents are new or changed in Forever. Your build is saved. Talent data from{" "}
          <a className="font-semibold text-cls underline" href={TALENTS_SOURCE} target="_blank" rel="noreferrer">
            wowforevertalents.com
          </a>
          .
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-inset px-3 py-1.5 font-bold text-gold-hi tabular-nums ring-1 ring-line">
            {total} / {MAX_POINTS} points
          </span>
          <span className="font-semibold text-fg-soft">
            {total ? `Needs level ${total + 9}` : "Points start at level 10"}
            {" · "}
            {trees.map((t, i) => treeTotal(spent, i)).join(" / ")}
          </span>
          <button type="button" onClick={() => setSpent({})} className="chip inline-flex items-center gap-1.5">
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {trees.map((tree, ti) => {
          const tiers = Math.max(...tree.talents.map((t) => t.t));
          return (
            <section key={tree.tree} className="code-panel flex flex-col items-center gap-3 p-4">
              <h3 className="gold-text font-display text-xl font-bold">
                {tree.tree} <span className="text-base">({treeTotal(spent, ti)})</span>
              </h3>
              <div className="grid gap-x-3 gap-y-4" style={{ gridTemplateColumns: "repeat(4, 52px)" }}>
                {Array.from({ length: tiers }, (_, row) =>
                  tree.talents
                    .filter((t) => t.t === row + 1)
                    .map((t, col) => {
                      const rank = spent[ti]?.[t.n] ?? 0;
                      const open = rank > 0 || canAdd(trees, spent, ti, t);
                      return (
                        <div key={t.n} style={{ gridRow: row + 1, gridColumn: Math.min(col, 3) + 1 }}>
                        <AbilityTip
                          ability={{
                            name: t.n,
                            icon: t.i ?? "",
                            meta: `Rank ${rank}/${t.r}${t.t > 1 ? ` · needs ${(t.t - 1) * 5} points in ${tree.tree}` : ""}${t.f ? " · Forever" : ""}`,
                            desc: t.e,
                          }}
                        >
                          <button
                            type="button"
                            aria-label={`${t.n}, rank ${rank} of ${t.r}`}
                            onClick={(e) => click(ti, t, e.shiftKey)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              click(ti, t, true);
                            }}
                            className={cn("relative block rounded-md transition", !open && "opacity-40 grayscale")}
                          >
                            <SpellIcon
                              ability={{ name: t.n, icon: t.i ?? "", meta: "", desc: "" }}
                              size={52}
                              glow={rank === t.r || (t.f && rank > 0)}
                            />
                            <span
                              className={cn(
                                "absolute -right-2 -bottom-2 rounded bg-[#0b0806] px-1 font-mono text-xs font-bold ring-1",
                                rank === t.r ? "text-gold-hi ring-gold" : rank ? "text-[#7fe07f] ring-[#3b7a3b]" : "text-muted ring-gold-lo",
                              )}
                            >
                              {rank}/{t.r}
                            </span>
                          </button>
                        </AbilityTip>
                        </div>
                      );
                    }),
                )}
              </div>
            </section>
          );
        })}
      </div>
      {trees.length === 0 && (
        <p className="py-10 text-center text-fg-soft italic">Talent data for this class isn’t loaded yet.</p>
      )}
    </div>
  );
}

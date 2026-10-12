import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { AbilityTip, primaryAbility, SpellIcon } from "@/components/spell-icon";
import { findMacro, type ClassId, type Macro } from "@/lib/macros";
import { cn, useStored } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];
export const DRAG_TYPE = "text/x-stancebook-macro";

/** Start dragging a macro from anywhere in the app. */
export function dragMacro(e: React.DragEvent, id: string) {
  e.dataTransfer.setData(DRAG_TYPE, id);
  e.dataTransfer.effectAllowed = "copyMove";
}

/** 12-slot action bar you fill by dragging macros in. Drag a slot off the bar or right-click it to clear it. */
export function ActionBar({
  classId,
  starters,
  selectedId,
  onOpen,
}: {
  classId: ClassId;
  starters: Macro[];
  selectedId?: string;
  onOpen: (id: string) => void;
}) {
  const fill = () => KEYS.map((_, i) => starters[i]?.id ?? null);
  const [slots, setSlots] = useStored<(string | null)[]>(`stancebook-bar-${classId}`, fill);
  const [over, setOver] = useState<number | null>(null);
  const put = (i: number, id: string | null) => setSlots(slots.map((s, j) => (j === i ? id : s)));

  function drop(e: React.DragEvent, i: number) {
    e.preventDefault();
    setOver(null);
    const id = e.dataTransfer.getData(DRAG_TYPE);
    if (!id) return;
    const from = Number(e.dataTransfer.getData("text/x-slot") || -1);
    const next = [...slots];
    if (from >= 0) next[from] = next[i]; // swap when moving between slots
    next[i] = id;
    setSlots(next);
  }

  return (
    <footer className="flex shrink-0 items-center justify-center gap-4 border-t border-gold-lo/40 bg-gradient-to-b from-[#1b120b] to-[#0b0806] px-4 py-2.5">
      <div className="hidden flex-col items-end md:flex">
        <span className="font-display text-sm font-semibold tracking-[0.2em] text-muted uppercase">Action bar</span>
        <span className="text-xs text-subtle">Drag macros onto a slot</span>
      </div>
      <ul className="flex gap-1.5 overflow-x-auto p-1">
        {slots.map((id, i) => {
          const m = id ? findMacro(id) : undefined;
          return (
            <li
              key={i}
              onDragOver={(e) => {
                if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
                e.preventDefault();
                setOver(i);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => drop(e, i)}
              className={cn("relative rounded-md", over === i && "ring-2 ring-gold-hi")}
            >
              {m ? (
                <AbilityTip ability={primaryAbility(m)}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      dragMacro(e, m.id);
                      e.dataTransfer.setData("text/x-slot", String(i));
                    }}
                    onDragEnd={(e) => e.dataTransfer.dropEffect === "none" && put(i, null)}
                    onClick={() => onOpen(m.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      put(i, null);
                    }}
                    aria-label={`${KEYS[i]}: ${m.name}`}
                    className="block transition-transform hover:-translate-y-0.5"
                  >
                    <SpellIcon macro={m} size={54} glow={selectedId === m.id} />
                  </button>
                </AbilityTip>
              ) : (
                <span className="block size-[54px] rounded-md bg-[#120d09] shadow-[inset_0_0_0_1px_var(--color-gold-lo),inset_0_2px_8px_#000]" />
              )}
              <span className="pointer-events-none absolute top-0.5 right-1 font-mono text-[15px] leading-none font-bold text-white [text-shadow:0_1px_2px_#000,0_0_3px_#000,0_0_3px_#000]">
                {KEYS[i]}
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => setSlots(fill())}
        title="Reset to the suggested macros"
        aria-label="Reset action bar"
        className="btn-leather grid size-9 place-items-center rounded-md"
      >
        <RotateCcw className="size-4" />
      </button>
    </footer>
  );
}

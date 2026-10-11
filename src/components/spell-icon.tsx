import {
  Cat,
  Cross,
  Crosshair,
  EyeOff,
  Flag,
  Flame,
  Hammer,
  HeartPulse,
  Leaf,
  PawPrint,
  Shield,
  Skull,
  Sparkles,
  Sword,
  Swords,
  TrendingUp,
  WandSparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CLASS_ICON_NAME, findAbility, ICON_CDN, spellsInLine, type Ability } from "@/lib/abilities";
import type { Category, ClassId, Macro } from "@/lib/macros";
import { cn } from "@/lib/utils";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  essential: Sparkles,
  combat: Swords,
  stance: Flag,
  tank: Shield,
  pvp: Skull,
  utility: Wrench,
  leveling: TrendingUp,
  pet: PawPrint,
  stealth: EyeOff,
  heal: HeartPulse,
  form: Cat,
};

export const CLASS_ICON: Record<ClassId, LucideIcon> = {
  warrior: Swords,
  paladin: Hammer,
  hunter: Crosshair,
  rogue: Sword,
  priest: Cross,
  shaman: Zap,
  mage: WandSparkles,
  warlock: Flame,
  druid: Leaf,
};

/** Icon gradient: tinted per category, nudged per macro so a page of spells isn't one flat color. */
const CATEGORY_HUE: Record<Category, number> = {
  essential: 42,
  combat: 8,
  stance: 28,
  tank: 210,
  pvp: 345,
  utility: 175,
  leveling: 95,
  pet: 60,
  stealth: 265,
  heal: 135,
  form: 24,
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** The ability a macro is "about": its #showtooltip spell, else the first spell it casts. */
export function primaryAbility(macro: Macro): Ability | undefined {
  for (const line of macro.lines) {
    for (const name of spellsInLine(line.code)) {
      const a = findAbility(macro.classId, name);
      if (a) return a;
    }
  }
  return undefined;
}

/** Real in-game icon art; falls back to a drawn glyph offline or if the art is missing. */
function IconArt({ icon, size, fallback }: { icon?: string; size: number; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (!icon || failed) return <>{fallback}</>;
  return (
    <img
      src={ICON_CDN + icon + ".jpg"}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="absolute inset-0 size-full rounded-[inherit] object-cover"
    />
  );
}

export function SpellIcon({
  macro,
  ability,
  size = 52,
  glow,
  className,
}: {
  macro?: Macro;
  ability?: Ability;
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  const a = ability ?? (macro && primaryAbility(macro));
  const category: Category = macro?.category ?? "combat";
  const Icon = CATEGORY_ICON[category];
  const key = macro?.id ?? a?.name ?? "";
  const hue = CATEGORY_HUE[category] + (hash(key) % 30) - 15;
  return (
    <span
      className={cn("slot overflow-hidden", glow && "slot-glow", className)}
      style={
        {
          width: size,
          height: size,
          "--slot-a": `hsl(${hue} 55% 42%)`,
          "--slot-b": `hsl(${hue + 20} 60% 14%)`,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <IconArt
        icon={a?.icon}
        size={size}
        fallback={<Icon size={Math.round(size * 0.5)} strokeWidth={1.75} />}
      />
    </span>
  );
}

export function ClassIcon({ id, size, fallback }: { id: ClassId; size: number; fallback: ReactNode }) {
  return <IconArt icon={CLASS_ICON_NAME[id]} size={size} fallback={fallback} />;
}

/** WoW-style tooltip shown on hover or keyboard focus. Rendered in a portal so scroll areas never clip it. */
export function AbilityTip({
  ability,
  children,
  className,
}: {
  ability?: Ability;
  children: ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState<{ x: number; y: number; below: boolean } | null>(null);
  if (!ability) return <span className={className}>{children}</span>;
  function show(e: React.SyntheticEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const below = r.top < 220;
    setPos({
      x: Math.min(Math.max(r.left + r.width / 2, 170), window.innerWidth - 170),
      y: below ? r.bottom + 8 : r.top - 8,
      below,
    });
  }
  return (
    <span
      className={className}
      onMouseEnter={show}
      onMouseLeave={() => setPos(null)}
      onFocus={show}
      onBlur={() => setPos(null)}
    >
      {children}
      {pos &&
        createPortal(
          <div
            role="tooltip"
            className="wow-tip"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, ${pos.below ? "0" : "-100%"})`,
            }}
          >
            <p className="wow-tip-name">{ability.name}</p>
            <p className="wow-tip-meta">{ability.meta}</p>
            <p className="wow-tip-desc">{ability.desc}</p>
          </div>,
          document.body,
        )}
    </span>
  );
}

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

export function SpellIcon({
  macro,
  size = 52,
  glow,
  className,
}: {
  macro: Macro;
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  const Icon = CATEGORY_ICON[macro.category];
  const hue = CATEGORY_HUE[macro.category] + (hash(macro.id) % 30) - 15;
  return (
    <span
      className={cn("slot", glow && "slot-glow", className)}
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
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.75} />
    </span>
  );
}

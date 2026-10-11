import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  children,
}: {
  className?: string;
  tone?: "muted" | "rust" | "accent" | "success";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        tone === "muted" && "text-ink-soft shadow-[inset_0_0_0_1px_var(--color-ink-line)]",
        tone === "rust" && "bg-crimson text-[#fff1e6]",
        tone === "accent" && "bg-[#2b4a6b] text-[#e6f1ff]",
        tone === "success" && "bg-[#3d5a2a] text-[#eef7e4]",
        className,
      )}
    >
      {children}
    </span>
  );
}

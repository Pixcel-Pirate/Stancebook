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
        tone === "muted" && "text-fg-soft shadow-[inset_0_0_0_1px_var(--color-line)]",
        tone === "rust" && "bg-cls/18 text-cls shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cls)_55%,transparent)]",
        tone === "accent" && "bg-[#2b4a6b]/60 text-[#cfe6ff]",
        tone === "success" && "bg-[#3d5a2a] text-[#eef7e4]",
        className,
      )}
    >
      {children}
    </span>
  );
}

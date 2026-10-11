import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const VARIANT = {
  primary: "btn-gold",
  secondary: "btn-leather",
  ghost: "text-ink-soft hover:bg-ink/8 hover:text-ink",
  rust: "btn-blood",
  outline: "text-ink shadow-[inset_0_0_0_1px_var(--color-ink-line)] hover:bg-ink/8",
};
const SIZE = {
  sm: "h-9 rounded-sm px-3 text-sm [&_svg]:size-4",
  md: "h-11 rounded-md px-4 text-sm [&_svg]:size-4",
  lg: "h-12 rounded-md px-5 text-base [&_svg]:size-5",
  icon: "size-11 rounded-md [&_svg]:size-5",
  "icon-sm": "size-9 rounded-sm [&_svg]:size-4",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof VARIANT; size?: keyof typeof SIZE }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[filter,transform,background-color,color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  );
}

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copy macro",
  className,
  size = "md",
  variant = "primary",
}: {
  text: string;
  label?: string;
  className?: string;
  size?: "md" | "sm" | "icon" | "icon-sm";
  variant?: "primary" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const iconOnly = size === "icon" || size === "icon-sm";

  return (
    <Button
      type="button"
      variant={copied ? "rust" : variant}
      size={size}
      onClick={onCopy}
      className={cn("min-w-11", className)}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check strokeWidth={2} /> : <Copy strokeWidth={2} />}
      {!iconOnly && <span>{copied ? "Copied" : label}</span>}
    </Button>
  );
}

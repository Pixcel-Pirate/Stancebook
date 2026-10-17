import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** useState that survives reloads (per key). Falls back to `init` if storage is unavailable, the key changes,
 *  or the saved value fails `valid` (storage can be edited by hand or left over from an older version). */
export function useStored<T>(key: string, init: () => T, valid: (v: unknown) => v is T) {
  const load = () => {
    try {
      const raw = localStorage.getItem(key);
      const v: unknown = raw ? JSON.parse(raw) : undefined;
      return valid(v) ? v : init();
    } catch {
      return init();
    }
  };
  const [state, setState] = useState<{ key: string; value: T }>(() => ({ key, value: load() }));
  const value = state.key === key ? state.value : load();
  const set = (v: T) => {
    setState({ key, value: v });
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* private mode: keep in memory only */
    }
  };
  return [value, set] as const;
}

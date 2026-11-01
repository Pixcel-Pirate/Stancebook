import { useStored } from "@/lib/utils";

const isIdList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

/** Favorite macro ids, saved across reloads. Uses useStored so a full or blocked storage can't crash the app. */
export function useFavorites() {
  const [ids, setIds] = useStored("stancebook-favorites", () => [] as string[], isIdList);
  const toggle = (id: string) => setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return { ids, toggle, has: (id: string) => ids.includes(id) };
}

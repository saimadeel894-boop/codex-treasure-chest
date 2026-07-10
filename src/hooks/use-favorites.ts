import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "nestoria:favorites";
const EVENT = "nestoria:favorites-change";

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeLocal(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT));
}

async function readRemote(userId: string): Promise<string[]> {
  const { data } = await supabase.from("favourites").select("property_id").eq("user_id", userId);
  return (data ?? []).map((r) => r.property_id as string);
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        readRemote(uid).then((remote) => mounted && setIds(remote));
      } else {
        setIds(readLocal());
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        readRemote(uid).then((remote) => setIds(remote));
      } else {
        setIds(readLocal());
      }
    });
    const sync = () => {
      if (!userId) setIds(readLocal());
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      if (userId) {
        const currently = ids.includes(id);
        if (currently) {
          setIds((prev) => prev.filter((v) => v !== id));
          await supabase.from("favourites").delete().eq("user_id", userId).eq("property_id", id);
          return false;
        } else {
          setIds((prev) => [...prev, id]);
          await supabase.from("favourites").insert({ user_id: userId, property_id: id });
          return true;
        }
      } else {
        const current = readLocal();
        const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
        writeLocal(next);
        setIds(next);
        return next.includes(id);
      }
    },
    [ids, userId],
  );

  const remove = useCallback(
    async (id: string) => {
      if (userId) {
        setIds((prev) => prev.filter((v) => v !== id));
        await supabase.from("favourites").delete().eq("user_id", userId).eq("property_id", id);
      } else {
        const next = readLocal().filter((v) => v !== id);
        writeLocal(next);
        setIds(next);
      }
    },
    [userId],
  );

  return { ids, isFavorite, toggle, remove };
}

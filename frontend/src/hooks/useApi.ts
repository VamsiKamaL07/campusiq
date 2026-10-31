import { useEffect, useState } from "react";
import { api, errorMessage } from "../services/api";

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    api.get<T>(path).then((r) => live && setData(r.data)).catch((e) => live && setError(errorMessage(e))).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [path]);
  return { data, error, loading };
}

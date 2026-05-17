'use client';

import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      setValue(initialValue);
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore local storage quota or privacy mode failures.
    }
  }, [key, ready, value]);

  const reset = () => setValue(initialValue);

  return [value, setValue, reset, ready] as const;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Global audio preference. Default = MUTED (never autoplay sound).
 * Persisted to localStorage so the choice survives navigation. The 3D layer
 * (Phase 4) reads `muted` to gate the AudioContext / reactive visuals.
 */
type AudioContextValue = {
  muted: boolean;
  setMuted: (m: boolean) => void;
  toggle: () => void;
};

const Ctx = createContext<AudioContextValue | null>(null);
const STORAGE_KEY = "swaraavali:muted";

export function AudioPreferenceProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(true); // default muted

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "false") setMutedState(false);
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    window.localStorage.setItem(STORAGE_KEY, String(m));
  }, []);

  const toggle = useCallback(() => setMuted(!muted), [muted, setMuted]);

  return <Ctx.Provider value={{ muted, setMuted, toggle }}>{children}</Ctx.Provider>;
}

export function useAudioPreference(): AudioContextValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAudioPreference must be used within AudioPreferenceProvider");
  return ctx;
}

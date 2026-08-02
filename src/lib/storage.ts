export interface LocalGameState {
  tinta: number;
  streak: number;
  mode: "NORMAL" | "HARDCORE_VOICE";
  anonId: string;
  guessesHistory: Record<string, { guesses: string[]; won: boolean; completedAt: string }>;
}

const STORAGE_KEY = "tekakonik_user_state_v1";

export function getLocalGameState(): LocalGameState {
  if (typeof window === "undefined") {
    return { tinta: 50, streak: 0, mode: "NORMAL", anonId: "guest_init", guessesHistory: {} };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to parse local game state:", e);
  }

  // Generate new anonymous ID if none exists
  const newAnonId = `guest_${Math.random().toString(36).substring(2, 9)}`;
  const defaultState: LocalGameState = {
    tinta: 50, // Initial welcome bonus
    streak: 0,
    mode: "NORMAL",
    anonId: newAnonId,
    guessesHistory: {},
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  } catch (e) {
    console.error("Failed to save local state:", e);
  }

  return defaultState;
}

export function saveLocalGameState(state: Partial<LocalGameState>): LocalGameState {
  const current = getLocalGameState();
  const updated = { ...current, ...state };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save local state:", e);
    }
  }
  return updated;
}

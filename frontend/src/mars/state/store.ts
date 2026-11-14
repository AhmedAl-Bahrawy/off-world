import { create } from "zustand";

export type MarsView =
  | "brief"
  | "play"
  | "quiz"
  | "result"
  | "pause"
  | "respawn"
  | "gameover"
  | "complete";

type MarsState = {
  view: MarsView;
  level: number;
  deaths: number;
  collected: number;
  quizResult: boolean;
  reset: () => void;
  setView: (view: MarsView) => void;
  setLevel: (level: number) => void;
  setDeaths: (deaths: number) => void;
  setCollected: (collected: number) => void;
  setQuizResult: (correct: boolean) => void;
};

export const useMarsStore = create<MarsState>((set) => ({
  view: "brief",
  level: 0,
  deaths: 0,
  collected: 0,
  quizResult: false,
  reset: () =>
    set({
      view: "brief",
      level: 0,
      deaths: 0,
      collected: 0,
      quizResult: false,
    }),
  setView: (view) => set({ view }),
  setLevel: (level) => set({ level }),
  setDeaths: (deaths) => set({ deaths }),
  setCollected: (collected) => set({ collected }),
  setQuizResult: (quizResult) => set({ quizResult }),
}));

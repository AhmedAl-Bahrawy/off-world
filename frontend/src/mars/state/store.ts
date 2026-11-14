import { create } from "zustand";

export type MarsView =
  | "brief"
  | "play"
  | "quiz"
  | "result"
  | "pause"
  | "respawn"
  | "gameover"
  | "complete"
  | "artifact"
  | "archive"
  | "evidence";

type MarsState = {
  view: MarsView;
  level: number;
  deaths: number;
  collected: number;
  quizResult: boolean;
  /** Knowledge-check outcome per mission index (true = answered correctly). */
  checkResults: Record<number, boolean>;
  /** Total falls across the whole chapter. */
  totalFalls: number;
  /** Artifacts the player has physically identified. */
  discoveredArtifacts: string[];
  /** Component ids the player has inspected. */
  inspectedComponents: string[];
  /** Evidence fragment ids the player has recovered. */
  recoveredEvidence: string[];
  /** Archive record ids the player has opened. */
  unlockedRecords: string[];
  /** Knowledge checks the player has passed. */
  completedChecks: string[];
  /** Artifacts whose chapter is complete. */
  completedArtifacts: string[];
  /** Reset mission-level state only — discovery progress survives. */
  reset: () => void;
  /** Reset absolutely everything, including the archive. */
  resetAll: () => void;
  setView: (view: MarsView) => void;
  setLevel: (level: number) => void;
  setDeaths: (deaths: number) => void;
  setCollected: (collected: number) => void;
  setQuizResult: (correct: boolean) => void;
  setCheckResult: (mission: number, correct: boolean) => void;
  addFall: () => void;
  discoverArtifact: (artifactId: string) => void;
  inspectComponent: (componentId: string) => void;
  recoverEvidence: (evidenceId: string) => void;
  unlockArchive: (recordId: string) => void;
  completeCheck: (checkId: string) => void;
  completeArtifact: (artifactId: string) => void;
};

const unique = (list: string[], value: string) =>
  list.includes(value) ? list : [...list, value];

export const useMarsStore = create<MarsState>((set) => ({
  view: "brief",
  level: 0,
  deaths: 0,
  collected: 0,
  quizResult: false,
  checkResults: {},
  totalFalls: 0,
  discoveredArtifacts: [],
  inspectedComponents: [],
  recoveredEvidence: [],
  unlockedRecords: [],
  completedChecks: [],
  completedArtifacts: [],
  reset: () =>
    set({
      view: "brief",
      level: 0,
      deaths: 0,
      collected: 0,
      quizResult: false,
      checkResults: {},
      totalFalls: 0,
    }),
  resetAll: () =>
    set({
      view: "brief",
      level: 0,
      deaths: 0,
      collected: 0,
      quizResult: false,
      checkResults: {},
      totalFalls: 0,
      discoveredArtifacts: [],
      inspectedComponents: [],
      recoveredEvidence: [],
      unlockedRecords: [],
      completedChecks: [],
      completedArtifacts: [],
    }),
  setView: (view) => set({ view }),
  setLevel: (level) => set({ level }),
  setDeaths: (deaths) => set({ deaths }),
  setCollected: (collected) => set({ collected }),
  setQuizResult: (quizResult) => set({ quizResult }),
  setCheckResult: (mission, correct) =>
    set((s) => ({ checkResults: { ...s.checkResults, [mission]: correct } })),
  addFall: () => set((s) => ({ totalFalls: s.totalFalls + 1 })),
  discoverArtifact: (artifactId) =>
    set((s) => ({
      discoveredArtifacts: unique(s.discoveredArtifacts, artifactId),
    })),
  inspectComponent: (componentId) =>
    set((s) => ({
      inspectedComponents: unique(s.inspectedComponents, componentId),
    })),
  recoverEvidence: (evidenceId) =>
    set((s) => ({ recoveredEvidence: unique(s.recoveredEvidence, evidenceId) })),
  unlockArchive: (recordId) =>
    set((s) => ({ unlockedRecords: unique(s.unlockedRecords, recordId) })),
  completeCheck: (checkId) =>
    set((s) => ({ completedChecks: unique(s.completedChecks, checkId) })),
  completeArtifact: (artifactId) =>
    set((s) => ({ completedArtifacts: unique(s.completedArtifacts, artifactId) })),
}));

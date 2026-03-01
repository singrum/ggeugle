import { sampleRules } from "~/constants/sample-rules";
import { WordSolver } from "~/lib/wordchain/word/word-solver";
import { ComlinkRunner } from "~/lib/worker/comlink-runner";
import { default as FuncWorker } from "~/lib/worker/func-worker?worker";
// import * as Comlink from "comlink";
import { type StateCreator } from "zustand";
import type { RuleSlice, Slices } from "../types/wc-store";

export const createRuleSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  RuleSlice
> = (set, get) => ({
  ruleForm: sampleRules[0], // 의미없음 (어차피 덮어씌워짐)
  funcWorkerRunner: new ComlinkRunner(FuncWorker),
  updateRule: async () => {
    const {
      ruleForm,
      setSearchResultMenu,
      onSolverLoaded,
      funcWorkerRunner,
      flow,
      prec,
    } = get();

    set({
      ruleForm,
      originalSolver: undefined,
      solver: undefined,
      exceptedWords: [],
      comparisonMap: undefined,
      prec,
    });

    setSearchResultMenu(0);

    const solver = await funcWorkerRunner.callAndTerminate("getWcData", [
      ruleForm,
      flow,
    ]);

    onSolverLoaded(solver);
  },
  onSolverLoaded: (solver: WordSolver) => {
    const { setSearchInputValue, searchInputValue, funcWorkerRunner } = get();
    funcWorkerRunner.terminate();
    solver = WordSolver.fromObj(solver!);
    set({ solver, originalSolver: solver });
    setSearchInputValue(searchInputValue);
  },

  flow: 0,
  setFlow: (flow: number) => {
    set({ flow });
    get().updateRule();
  },
});

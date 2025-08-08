import { sampleRules } from "@/constants/sample-rules";
import { isEqualRules, removeMetaData, setTitle, toObject } from "@/lib/utils";
import { WordSolver } from "@/lib/wordchain/word/word-solver";
import { ComlinkRunner } from "@/lib/worker/comlink-runner";
import { default as FuncWorker } from "@/lib/worker/func-worker?worker";
import type { RuleForm } from "@/types/rule";
// import * as Comlink from "comlink";
import { cates, kkutuInfo, poses } from "@/constants/rule";
import { samplePrecedenceMaps } from "@/constants/sample-precedence-maps";
import type { PrecedenceMaps } from "@/types/search";
import { cloneDeep } from "lodash";
import { type StateCreator } from "zustand";
import type { RuleSlice, Slices } from "../types/wc-store";

export const createRuleSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  RuleSlice
> = (set, get) => ({
  funcWorkerRunner: new ComlinkRunner(FuncWorker),

  kkutuLocalRule: { gameType: 0, manner: 0, injeong: false },
  setKkutuRule: () => {
    const { kkutuLocalRule } = get();
    setTitle(
      `끄투코리아-${kkutuInfo.gameType[kkutuLocalRule.gameType]}-${kkutuInfo.injeong[Number(kkutuLocalRule.injeong)]}-${kkutuInfo.manner[kkutuLocalRule.manner]}`,
    );
    set((state) => {
      state.localRule = {
        metadata: {
          title: `끄투코리아-${kkutuInfo.gameType[kkutuLocalRule.gameType]}-${kkutuInfo.injeong[Number(kkutuLocalRule.injeong)]}-${kkutuInfo.manner[kkutuLocalRule.manner]}`,
          description: "",
        },
        wordRule: {
          words: {
            type: "selected",
            option: {
              dict: kkutuLocalRule.injeong ? 5 : 4,
              pos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
              cate: toObject(cates, [1, 1, 1, 1]),
            },
          },

          regexFilter:
            kkutuLocalRule.gameType === 1
              ? "(.{3})"
              : kkutuLocalRule.gameType === 0 &&
                  kkutuLocalRule.manner === 1 &&
                  !kkutuLocalRule.injeong
                ? "(?!(껏구리)$).*"
                : ".*",
          removedWords: "",
          addedWords: "",
        },
        wordConnectionRule: {
          changeFuncIdx: 1,
          rawHeadIdx: 1,
          headDir: kkutuLocalRule.gameType === 2 ? 1 : 0,
          rawTailIdx: 1,
          tailDir: kkutuLocalRule.gameType === 2 ? 0 : 1,
        },
        postprocessing: {
          manner: {
            type: (kkutuLocalRule.manner === 2 ? 3 : kkutuLocalRule.manner) as
              | 0
              | 1
              | 2
              | 3,
            nextWordsLimit: kkutuLocalRule.manner === 2 ? 6 : undefined,
          },
          addedWords: "",
          removedWords: "",
        },
      };
    });
    get().updateRule();
  },
  localRule: cloneDeep(sampleRules[0]),
  ruleJsonInputValue: "",
  initRuleJsonInputValue: () => {
    const { localRule } = get();

    set({
      ruleJsonInputValue: JSON.stringify(removeMetaData(localRule), null, 2),
      isValidJson: true,
    });
  },
  setRuleJsonInputValue: (value: string) => {
    try {
      const parsed = JSON.parse(value);

      set({
        isValidJson: true,
        ruleJsonInputValue: value,
        localRule: parsed,
      });
    } catch {
      set({
        isValidJson: false,
        ruleJsonInputValue: value,
      });
    }
  },
  isValidJson: true,
  rule: sampleRules[0],
  restoreLocalRule: () => {
    const { rule } = get();
    set({
      localRule: cloneDeep(rule),
      ruleJsonInputValue: JSON.stringify(removeMetaData(rule), null, 2),
      isValidJson: true,
    });
  },
  updateRule: async () => {
    const { localRule, setSearchResultMenu, onSolverLoaded, funcWorkerRunner } =
      get();

    const rule = cloneDeep(localRule);

    if (!rule.metadata) {
      rule.metadata = sampleRules.find((sampleRule) =>
        isEqualRules(sampleRule, rule),
      )?.metadata;
      setTitle(rule.metadata ? rule.metadata.title : "커스텀 룰");
    }
    const precedenceMaps: PrecedenceMaps = { node: {}, edge: {} };
    if (rule.metadata && samplePrecedenceMaps[rule.metadata.title]) {
      const { edge, node } = samplePrecedenceMaps[rule.metadata.title];
      precedenceMaps.edge = edge ?? {};
      precedenceMaps.node = node ?? {};
    }
    set({
      rule,
      originalSolver: undefined,
      solver: undefined,
      exceptedWords: [],
      comparisonMap: undefined,
    });
    set((state) => {
      state.prec.maps = precedenceMaps;
    });

    setSearchResultMenu(0);

    const solver = await funcWorkerRunner.callAndTerminate("getWcData", rule);

    onSolverLoaded(solver);
  },
  setRule: (rule: RuleForm) => {
    const { updateRule } = get();
    set({ localRule: rule });
    updateRule();
    setTitle(rule.metadata!.title);
  },
  syncRule: () => {
    const { exceptedWords, updateRule } = get();
    set((state) => {
      state.localRule.postprocessing.removedWords =
        state.localRule.postprocessing.removedWords +
        " " +
        exceptedWords.join(" ");
      state.localRule.metadata = undefined;
    });

    updateRule();
  },

  onSolverLoaded: (solver: WordSolver) => {
    const { setSearchInputValue, searchInputValue, funcWorkerRunner } = get();
    funcWorkerRunner.terminate();
    solver = WordSolver.fromObj(solver!);

    set({ solver, originalSolver: solver });
    setSearchInputValue(searchInputValue);
  },

  ruleSettingsMenu: 0,
  setRuleSettingsMenu: (menu: number) => {
    set({ ruleSettingsMenu: menu });
  },
});

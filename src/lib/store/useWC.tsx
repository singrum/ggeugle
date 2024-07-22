import { create } from "zustand";
import { Char, SearchResult, WCDisplay, WCEngine } from "../wc/wordChain";

import { ChangedCharsAlert } from "@/pages/body/search/ChangedCharsAlert";
import toast from "react-hot-toast";
export type changeInfo = Record<Char, { prevType: string; currType: string }>;

export const dicts = ["(구)표국대", "(신)표국대", "우리말샘"];

export const poses = [
  "명사",
  "의존명사",
  "대명사",
  "수사",
  "부사",
  "관형사",
  "감탄사",
  "구",
];

export const cates = ["일반어", "방언", "북한어", "옛말"];

export interface RuleForm {
  dict: number;
  pos: boolean[]; // 8
  cate: boolean[]; // 4
  chan: number;
  headDir: 0 | 1;
  tailDir: 0 | 1;
  headIdx: number;
  tailIdx: number;
  manner: boolean;
  regexFilter: string;
  addedWords: string;
}

export interface WCInfo {
  value: string;
  setValue: (value: string) => void;
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  exceptWords: string[];
  setExceptWords: (exceptWords: string[]) => void;
  searchResult: SearchResult;

  worker?: Worker;
  prevEngine?: WCEngine;
  engine?: WCEngine;
  initWorker: () => void;
  isLoading: boolean;
  changeInfo: changeInfo;
  setChangeInfo: (changeInfo: changeInfo) => void;

  rule: RuleForm;
  ruleForm: RuleForm;
  setRuleForm: (ruleForm: RuleForm) => void;
  updateRule: () => void;
}

export const useWC = create<WCInfo>((set, get) => ({
  value: "",
  setValue: (value: string) => set(() => ({ value })),
  searchInputValue: "",
  setSearchInputValue: (searchInputValue: string) => {
    set(() => ({
      searchInputValue,
      searchResult: WCDisplay.searchResult(get().engine!, searchInputValue),
    }));
  },
  exceptWords: [],
  setExceptWords: (exceptWords: string[]) => {
    set(() => ({ exceptWords, isLoading: true }));

    get().worker!.postMessage({
      action: "setWords",
      data: exceptWords,
    });
  },
  searchResult: undefined,

  isLoading: true,
  worker: new Worker(new URL("../worker/worker.ts", import.meta.url), {
    type: "module",
  }),
  engine: undefined,
  initWorker: () => {
    const worker = get().worker;

    worker!.onmessage = ({ data }) => {
      switch (data.action) {
        case "getEngine":
          const engine = data.data;
          const prevEngine = get().engine;

          set(() => ({
            prevEngine,
            engine,
            isLoading: false,
            searchResult: WCDisplay.searchResult(engine!, get().value),
          }));

          if (engine && prevEngine) {
            let exist = false;
            const changeInfo: Record<
              Char,
              { prevType: string; currType: string }
            > = {};

            for (let char in prevEngine!.charInfo) {
              const prevType = WCDisplay.reduceWordtype(
                prevEngine!.charInfo[char].type!
              );
              const currType = engine!.charInfo[char]
                ? WCDisplay.reduceWordtype(engine!.charInfo[char].type!)
                : "deleted";

              if (prevType !== currType) {
                changeInfo[char] = { prevType, currType };
                exist = true;
              }
            }

            if (exist) {
              toast(<ChangedCharsAlert changeInfo={changeInfo} />);
            }
            set(() => ({ changeInfo }));
          }

          break;
      }
    };
    
  },
  changeInfo: {},
  setChangeInfo: (changeInfo) => {
    set(() => ({
      changeInfo,
    }));
  },

  rule: {
    dict: 0,
    pos: [true, false, false, false, false, false, false, false],
    cate: [true, true, true, true],
    len: [true, true, true, true, true, true, true, true, true],
    chan: 1,
    headDir: 0,
    headIdx: 1,
    tailDir: 1,
    tailIdx: 1,
    manner: false,
    regexFilter: ".*",
    addedWords: "",
  },

  ruleForm: {
    dict: 0,
    pos: [true, false, false, false, false, false, false, false],
    cate: [true, true, true, true],
    chan: 1,
    headDir: 0,
    headIdx: 1,
    tailDir: 1,
    tailIdx: 1,
    manner: false,
    regexFilter: ".*",
    addedWords: "",
  },
  setRuleForm: (ruleForm: RuleForm) => set({ ruleForm }),
  updateRule: () => {
    const ruleForm = get().ruleForm;

    set(() => ({
      engine: undefined,
      prevEngine: undefined,
      exceptWords: [],
      isLoading: true,
      rule: ruleForm,
    }));

    get().worker!.postMessage({ action: "getEngine", data: ruleForm });
  },
}));

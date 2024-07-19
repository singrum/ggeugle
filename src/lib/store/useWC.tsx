import { create } from "zustand";
import { Char, SearchResult, WCDisplay, WCEngine } from "../wc/wordChain";
import toast from "react-hot-toast";
import { ChangedCharsAlert } from "@/pages/body/search/ChangedCharsAlert";
export type changeInfo = Record<Char, { prevType: string; currType: string }>;

export interface RuleForm {
  dict: number;
  pos: boolean[]; // 8
  cate: boolean[]; // 4
  len: boolean[]; // 9
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
  rule: RuleForm;
  isLoading: boolean;
  setRule: (rule: RuleForm) => void;
  changeInfo: changeInfo;
  setChangeInfo: (changeInfo: changeInfo) => void;
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
          // console.log(WCDisplay.searchResult(engine!, get().value));
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
  setRule: (rule: RuleForm) => set(() => ({ rule })),
  changeInfo: {},
  setChangeInfo: (changeInfo) => {
    set(() => ({
      changeInfo,
    }));
  },
}));

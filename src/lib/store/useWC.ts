import { create } from "zustand";
import { Rule, WCengine } from "../wc/WordChain";

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
export interface WordClass {
  outWordClass: { [key: string]: string[] };
  inWordClass: { [key: string]: string[] };
}
export interface CharClass {
  endInN: {
    win: { key: string; chars: string[] }[];
    los: { key: string; chars: string[] }[];
    route: string[][];
  };
  frequency: {
    win: string[];
    los: string[];
    route: string[];
  };
}
export interface WCInfo {
  worker?: Worker;
  initWorker: () => void;
  charClass?: CharClass;
  wordClass?: WordClass;
  words?: Set<string>;
  rule: RuleForm;
  setRule: (rule: RuleForm) => void;
}

export const useWC = create<WCInfo>((set, get) => ({
  worker: new Worker(new URL("../worker/worker.ts", import.meta.url), {
    type: "module",
  }),
  words: undefined,
  charClass: undefined,
  wordClass: undefined,
  initWorker: () => {
    const worker = get().worker;
    worker!.onmessage = ({ data }) => {
      switch (data.action) {
        case "initData":
          set(() => ({
            words: new Set(data.data.words),
            charClass: data.data.charClass,
          }));

          break;

        case "getWordClass":
          set(() => ({ wordClass: data.data }));

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
}));

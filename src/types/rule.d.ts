import type { cates, poses } from "@/constants/rule";

export type WordRule = {
  words:
    | {
        type: "manual";
        option: ManualWordsOption;
      }
    | { type: "selected"; option: SelectedWordsOption };
  regexFilter: string;
  removedWords: string;
  addedWords: string;
};

export type ManualWordsOption = { content: string };

export interface SelectedWordsOption {
  dict: number;
  pos: Record<Pos, 0 | 1>;
  cate: Record<Cate, 0 | 1>;
}
export type Pos = (typeof poses)[number];
export type Cate = (typeof cates)[number];
export interface Postprocessing {
  manner: { type: 0 | 1 | 2 | 3; nextWordsLimit?: number | undefined };
  addedWords: string;
  removedWords: string;
}

export interface WordConnectionRule {
  changeFunc: ChangeFunc;
  headIdx: number;
  tailIdx: number;
}

export interface WordConnectionRuleForm {
  changeFuncIdx: number;
  rawHeadIdx: number;
  headDir: 0 | 1;
  rawTailIdx: number;
  tailDir: 0 | 1;
}

export interface RuleMetadata {
  title: string;
  description: string;
}

export interface RuleForm {
  metadata?: RuleMetadata;
  wordRule: WordRule;
  wordConnectionRule: WordConnectionRuleForm;
  postprocessing: Postprocessing;
}

export type ChangeFunc = {
  forward: (char: string) => string[];
  backward: (char: string) => string[];
};

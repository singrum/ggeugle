import ChangeableChars from "@/app/search/search-result/changeable-chars/changeable-chars";
import Distribution from "@/app/search/search-result/distribution/distribution";

import Comparison from "@/app/search/search-result/comparison/comparison";
import CriticalWords from "@/app/search/search-result/critical-words/critical-words";
import Download from "@/app/search/search-result/download/download";
import IncludePattern from "@/app/search/search-result/include-pattern/include-pattern";
import MatchPattern from "@/app/search/search-result/match-pattern/match-pattern";
import NextWords from "@/app/search/search-result/next-words/next-words";
import PrevWords from "@/app/search/search-result/prev-words/prev-words";
import Scc from "@/app/search/search-result/scc/scc";
import Statistics from "@/app/search/search-result/statistics/statistics";
import MultiThreadSearch from "@/app/search/search-result/strategy-search/multi-thread-search/multi-thread-search";
import SingleThreadSearch from "@/app/search/search-result/strategy-search/single-thread-search/single-thread-search";
import StrategySearch from "@/app/search/search-result/strategy-search/strategy-search";
import StrategyTree from "@/app/search/search-result/strategy-tree/strategy-tree";
import type { NodePos, NodeType } from "@/lib/wordchain/graph/graph";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import type { SearchInputType } from "@/types/search";
import { Circle, MoveRight } from "lucide-react";

export const charMenuInfo = [
  { title: "승리", key: "win" },
  { title: "패배", key: "lose" },
  { title: "순환", key: "loopwin" },
  { title: "루트", key: "route" },
];

export const viewInfo = [
  { title: "끝 음절", Icon: Circle },
  { title: "첫 음절", Icon: MoveRight },
];

export const typeMap: Record<NodeType, string> = {
  win: "승리",
  lose: "패배",
  loopwin: "순환",
  route: "루트",
};

export const DATA_LOADING = 1;
export const SOLVER_LOADING = 2;
export const TERMINATED = 3;

export const searchResultMenuInfo: Record<
  SearchInputType,
  {
    title: string;
    component: React.ComponentType<{
      solver: WordSolver;
    }>;
  }[]
> = {
  empty: [
    { title: "통계", component: Statistics },
    { title: "음절별 단어 분포", component: Distribution },
    { title: "강한 연결 요소", component: Scc },
    { title: "전략 탐색", component: StrategySearch },
    { title: "임계 단어", component: CriticalWords },
    { title: "비교", component: Comparison },
    { title: "파일 내보내기", component: Download },
  ],
  winlose: [
    { title: "첫 글자", component: NextWords },
    { title: "끝 글자", component: PrevWords },
    { title: "전략 트리", component: StrategyTree },
    { title: "두음 법칙", component: ChangeableChars },
  ],
  route: [
    { title: "첫 글자", component: NextWords },
    { title: "끝 글자", component: PrevWords },
    { title: "전략 탐색", component: StrategySearch },
    { title: "두음 법칙", component: ChangeableChars },
  ],
  word: [
    { title: "일치", component: MatchPattern },
    { title: "포함", component: IncludePattern },
  ],
};

export const maxMinComp = [
  { title: "주요 루트 음절" },
  { title: "희귀 루트 음절" },
];

export const strategySearchMethods: {
  title: string;
  component: React.ComponentType<{ solver: WordSolver }>;
}[] = [
  { title: "싱글 쓰레드 탐색", component: SingleThreadSearch },
  { title: "멀티 쓰레드 탐색", component: MultiThreadSearch },
];

export const guelMaxRouteCharData = [
  { charNum: 86, moveNum: 587, averageNum: 7.302 },
  { charNum: 85, moveNum: 587, averageNum: 6.906 },
];

export const downloadActionData: {
  title: string;
  action: {
    getJson: (solver: WordSolver, view: NodePos) => string;
    getText: (solver: WordSolver, view: NodePos) => string;
  };
}[][] = [
  [
    {
      title: "모든 단어 목록",
      action: {
        getJson: (solver: WordSolver) => {
          const words = solver.wordMap.getAllWords();
          words.sort();
          return JSON.stringify(words, null, 2);
        },
        getText: (solver: WordSolver) => {
          const words = solver.wordMap.getAllWords();
          words.sort();
          return words.join("\n");
        },
      },
    },
    {
      title: "음절 목록",
      action: {
        getJson: (solver: WordSolver, view: NodePos) => {
          const data = {
            win: solver.graphSolver.getWinloseNodes("win", view),
            lose: solver.graphSolver.getWinloseNodes("lose", view),
            loopwin: solver.graphSolver.getWinloseNodes("loopwin", view),
            route: solver.graphSolver.getRouteNodes(view),
          };
          return JSON.stringify(data, null, 2);
        },
        getText: (solver: WordSolver, view: NodePos) => {
          const data = {
            win: solver.graphSolver.getWinloseNodes("win", view),
            lose: solver.graphSolver.getWinloseNodes("lose", view),
            loopwin: solver.graphSolver.getWinloseNodes("loopwin", view),
            route: solver.graphSolver.getRouteNodes(view),
          };

          return (
            `[승리]\n${data.win.map(({ depth, nodes }) => `깊이 ${depth} : ${nodes.join(" ")}\n`).join("\n")}\n` +
            `[패배]\n${data.lose.map(({ depth, nodes }) => `깊이 ${depth} : ${nodes.join(" ")}\n`).join("\n")}\n` +
            `[순환]\n${data.loopwin.map(({ depth, nodes }) => `깊이 ${depth} : ${nodes.join(" ")}\n`).join("\n")}\n` +
            `[루트]\n주요 : ${data.route[0].join(" ")}\n희귀 : ${data.route[1].join(" ")}`
          );
        },
      },
    },
  ],

  [
    {
      title: "필수 공격 단어",
      action: {
        getJson: (solver: WordSolver, pos: NodePos) =>
          JSON.stringify(solver.getEssentialWinWordsFile(pos), null, 2),
        getText: (solver: WordSolver, pos: NodePos) =>
          solver
            .getEssentialWinWordsFile(pos)
            .map(({ char, word }) => `${char} : ${word}`)
            .join("\n"),
      },
    },
    {
      title: "공격 단어",
      action: {
        getJson: (solver: WordSolver, view: NodePos) => {
          return JSON.stringify(solver.getWinWordsFile(view), null, 2);
        },
        getText: (solver: WordSolver, view: NodePos) => {
          const data = solver.getWinWordsFile(view);
          return data
            .map(({ char, info }) =>
              [
                `[${char}]\n`,
                info
                  .map(
                    ({ depth, words }) => `깊이 ${depth} : ${words.join(", ")}`,
                  )
                  .join("\n"),
              ].join(""),
            )
            .join("\n\n");
        },
      },
    },

    {
      title: "방어 단어",
      action: {
        getJson: (solver: WordSolver, view: NodePos) => {
          return JSON.stringify(solver.getBangdanFile(view), null, 2);
        },
        getText: (solver: WordSolver, view: NodePos) => {
          const data = solver.getBangdanFile(view);
          return data
            .map(({ char, info }) =>
              [
                `[${char}]\n`,
                info
                  .map(
                    ({ depth, words }) =>
                      (depth === undefined ? "돌림" : `깊이 ${depth}`) +
                      ` : ${words.join(", ")}`,
                  )
                  .join("\n"),
              ].join(""),
            )
            .join("\n\n");
        },
      },
    },
  ],
  [
    {
      title: "주요 루트 단어",
      action: {
        getJson: (solver: WordSolver, view: NodePos) =>
          JSON.stringify(solver.getRouteWordsFile(view, 0), null, 2),
        getText: (solver: WordSolver, view: NodePos) =>
          solver
            .getRouteWordsFile(view, 0)
            .map(({ char, words }) => `${char} : ${words.join(", ")}`)
            .join("\n"),
      },
    },
    {
      title: "희귀 루트 단어",
      action: {
        getJson: (solver: WordSolver, view: NodePos) =>
          JSON.stringify(solver.getRouteWordsFile(view, 1), null, 2),
        getText: (solver: WordSolver, view: NodePos) =>
          solver
            .getRouteWordsFile(view, 1)
            .map(({ char, words }) => `${char} : ${words.join(", ")}`)
            .join("\n"),
      },
    },
  ],
  [
    {
      title: "돌림 단어",
      action: {
        getJson: (solver: WordSolver) =>
          JSON.stringify(solver.getRemovedWordsFile(), null, 2),
        getText: (solver: WordSolver) =>
          solver
            .getRemovedWordsFile()
            .map(([a, b]) => `${a}, ${b}`)
            .join("\n"),
      },
    },
  ],
];

export const threadSelectArr = ["1", "2", "4", "8", "16", "inf"];

export const threadSelectInfo: Record<
  string,
  { title: string; value: number }
> = {
  "1": { title: "1개", value: 1 },
  "2": { title: "2개", value: 2 },
  "4": { title: "4개", value: 4 },
  "8": { title: "8개", value: 8 },
  "16": { title: "16개", value: 16 },
  inf: { title: "제한 없음", value: 99999999 },
};

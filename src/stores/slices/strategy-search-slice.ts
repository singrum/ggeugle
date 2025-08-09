import { threadSelectInfo } from "@/constants/search";
import { arrayToEdgeObject } from "@/lib/utils";
import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import { default as FuncWorker } from "@/lib/worker/func-worker?worker";
import type { SingleThreadSearechStatus } from "@/types/search";
import type { StateCreator } from "zustand";

import type { NodeName, SingleMove } from "@/lib/wordchain/graph/graph";
import { ComlinkRunner } from "@/lib/worker/comlink-runner";
import { proxy } from "comlink";
import { v4 } from "uuid";
import type { Slices, StrategySearchSlice } from "../types/wc-store";

export const createStrategySearchSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  StrategySearchSlice
> = (set, get) => ({
  strategySearchMethod: 0,
  setStrategySearchMethod: (strategySearchMethod: number) =>
    set({ strategySearchMethod }),

  maxThreadValue: "1",
  setMaxThreadValue: (val: string) => {
    const { maximizeSingleThreadSearch, truncateSingleThreadSearch } = get();
    set({ maxThreadValue: val });
    maximizeSingleThreadSearch();
    truncateSingleThreadSearch();
  },

  initSingleThreadSearch: () => {
    const { solver, view, searchInputValue, rule, maximizeSingleThreadSearch } =
      get();

    // search info 초기화
    let moves: [NodeName, NodeName][];
    if (searchInputValue.length === 0) {
      moves = solver!.graphSolver.graphs
        .getGraph("route")
        .nodes(0)
        .map((e) => ["__none", e] as [NodeName, NodeName])
        .sort((a, b) =>
          solver!.graphSolver.graphs
            .getGraph("route")
            .compareNextMoveNum(a, b, get().prec),
        );
    } else {
      moves = solver!.graphSolver.graphs
        .getGraph("route")
        .getMovesFromNode(
          searchInputValue,
          view,
          0,
          sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx],
        )
        .sort((a, b) =>
          solver!.graphSolver.graphs
            .getGraph("route")
            .compareNextMoveNum(a, b, get().prec),
        );
    }

    const singleThreadSearchInfo = {
      moves: moves.map((e) => [e[0], e[1]] as [NodeName, NodeName]),
      mapping: arrayToEdgeObject(
        moves.map(([a, b]) => [
          a,
          b,
          {
            status: "pending" as SingleThreadSearechStatus,
            stack: [],
          },
        ]),
      ),
    };
    set({
      singleThreadSearchInfo,
    });
    if (moves.length > 0) {
      maximizeSingleThreadSearch();
    }
  },
  startSingleThreadSearch: (move: SingleMove) => {
    const runner = new ComlinkRunner(FuncWorker);
    const callbackId = v4();
    set((state) => {
      const info = state.singleThreadSearchInfo.mapping[move[0]][move[1]];
      info.runner = runner;
      info.status = "searching";
      info.stack = [];
      info.id = callbackId;
    });
    runner.callAndTerminate(
      "startStreamingSingleThreadSearch",
      proxy(
        (
          data:
            | { action: "stack"; payload: SingleMove[] }
            | {
                action: "done";
                payload: {
                  isWin: boolean;
                  duration: number;
                  optimalPath: SingleMove[];
                };
              },
        ) => {
          if (
            callbackId !==
            get().singleThreadSearchInfo.mapping[move[0]][move[1]].id
          ) {
            return;
          }
          const { action, payload } = data;

          if (action === "stack") {
            set((state) => {
              if (
                state.singleThreadSearchInfo.mapping[move[0]]?.[move[1]]
                  .status === "searching"
              ) {
                state.singleThreadSearchInfo.mapping[move[0]][move[1]].stack =
                  payload;
              }
            });
          } else if (action === "done") {
            set((state) => {
              const info =
                state.singleThreadSearchInfo.mapping[move[0]][move[1]];
              info.status = "done";
              info.isWin = payload.isWin;
              info.runner = undefined;
              info.duration = payload.duration;
              info.stack = payload.optimalPath;
            });

            runner.terminate();

            get().maximizeSingleThreadSearch();
          }
        },
      ),
      get().solver!.graphSolver.graphs.getGraph("route"),
      move,
      get().prec,
    );
  },

  maximizeSingleThreadSearch: () => {
    const { singleThreadSearchInfo, startSingleThreadSearch, maxThreadValue } =
      get();
    let count = threadSelectInfo[maxThreadValue].value;
    const toSearch: [NodeName, NodeName][] = [];
    for (const [start, end] of singleThreadSearchInfo.moves) {
      const info = singleThreadSearchInfo.mapping[start][end];
      if (count === 0) {
        break;
      }
      if (info.status === "searching") {
        count -= 1;
      } else if (info.status === "pending") {
        count -= 1;
        toSearch.push([start, end]);
      }
    }
    toSearch.forEach((e) => startSingleThreadSearch(e));
  },
  truncateSingleThreadSearch: () => {
    const { singleThreadSearchInfo, maxThreadValue, resetSingleThreadSearch } =
      get();

    let count = threadSelectInfo[maxThreadValue].value;
    const toReset: [NodeName, NodeName][] = [];
    for (const [start, end] of singleThreadSearchInfo.moves) {
      const info = singleThreadSearchInfo.mapping[start][end];

      if (info.status === "searching") {
        if (count === 0) {
          toReset.push([start, end]);
        } else {
          count -= 1;
        }
      }
    }
    toReset.forEach((e) => resetSingleThreadSearch(e));
  },

  resetSingleThreadSearch(move: SingleMove) {
    const { singleThreadSearchInfo } = get();
    singleThreadSearchInfo.mapping[move[0]][move[1]].runner?.terminate();

    set((state) => {
      const info = state.singleThreadSearchInfo.mapping[move[0]][move[1]];
      info.runner = undefined;
      info.status = "pending";
      info.stack = [];
    });
  },
  clearSingleThreadSearch() {
    const { singleThreadSearchInfo } = get();

    const moves = singleThreadSearchInfo.moves;
    for (const [start, end] of moves) {
      singleThreadSearchInfo.mapping[start][end].runner?.terminate();
    }

    set({ singleThreadSearchInfo: { moves: [], mapping: {} } });
  },
  singleThreadSearchInfo: { moves: [], mapping: {} },

  prec: { rule: 0, mmDepth: 1, maps: { edge: {}, node: {} } },
});

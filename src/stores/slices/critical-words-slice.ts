import type { StateCreator } from "zustand";

import type { NodeName, SingleMove } from "@/lib/wordchain/graph/graph";
import { ComlinkRunner } from "@/lib/worker/comlink-runner";
import { default as FuncWorker } from "@/lib/worker/func-worker?worker";
import type { CriticalWordInfo } from "@/types/search";
import { cloneDeep, throttle } from "lodash";

import { proxy } from "comlink";
import { v4 } from "uuid";
import type { CriticalWordsSlice, Slices } from "../types/wc-store";

export const createCriticalWordsSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  CriticalWordsSlice
> = (set, get) => ({
  criticalEdgeMap: undefined,
  initCriticalWords: () => {
    const {
      solver,
      view,
      criticalWordsThrottledUpdate,
      criticalWordsWorkerRunner,
    } = get();
    criticalWordsWorkerRunner?.terminate();
    criticalWordsThrottledUpdate.cancel();

    const runner = new ComlinkRunner(FuncWorker);

    if (!solver) {
      return;
    }

    const criticalEdges = solver.graphSolver.graphs
      .getGraph("route")
      .getCriticalEdges();
    const criticalEdgeMap: Record<
      NodeName,
      Record<NodeName, CriticalWordInfo>
    > = {};
    for (const [head, tail] of criticalEdges) {
      (criticalEdgeMap[head] ??= {})[tail] = {
        word: solver.wordMap.get(head, tail)!.at(-1)!,
      };
    }
    const id = v4();
    set({
      criticalWordsWorkerRunner: runner,
      criticalEdgeMap,
      criticalWordsCallbackId: id,
    });
    runner.callAndTerminate("startStreamingCriticalWordsInfo", [
      proxy(
        ({
          move,
          difference,
        }: {
          move: SingleMove;
          difference: {
            win: NodeName[];
            lose: NodeName[];
            loopwin: NodeName[];
          };
        }) => {
          if (id !== get().criticalWordsCallbackId) {
            return;
          }
          criticalEdgeMap[move[0]][move[1]].difference = difference;
          criticalWordsThrottledUpdate(cloneDeep(criticalEdgeMap));
        },
      ),
      solver!.graphSolver.graphs.getGraph("route"),
      view,
      undefined,
      get().flow,
    ]);
  },
  clearCriticalWords: () => {
    const { criticalWordsWorkerRunner, criticalWordsThrottledUpdate } = get();
    criticalWordsWorkerRunner?.terminate();
    criticalWordsThrottledUpdate.cancel();

    set({ criticalWordsWorkerRunner: undefined, criticalEdgeMap: undefined });
  },
  criticalWordsThrottledUpdate: throttle(
    (criticalEdgeMap: CriticalWordsSlice["criticalEdgeMap"]) => {
      set({ criticalEdgeMap });
    },
    300,
    { leading: true, trailing: true },
  ),
});

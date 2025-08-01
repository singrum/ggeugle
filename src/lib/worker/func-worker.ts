import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import { loadWords } from "@/lib/wordchain/word/load-data";
import type { RuleForm } from "@/types/rule";
import type { PrecedenceMaps } from "@/types/search";
import * as Comlink from "comlink";
import { round, throttle } from "lodash";
import { getHeadTail, getIdx } from "../utils";
import { BipartiteDiGraph } from "../wordchain/graph/bipartite-digraph";
import { classify } from "../wordchain/graph/classify";
import type { NodeName, NodePos, SingleMove } from "../wordchain/graph/graph";
import { GraphPartitions } from "../wordchain/graph/graph-partitions";
import { GraphSolver } from "../wordchain/graph/graph-solver";
import { WordMap } from "../wordchain/word/word-map";
import { WordSolver } from "../wordchain/word/word-solver";
import { isWin } from "./common";

export type FuncWorkerApi = {
  getWcData(rule: RuleForm): Promise<WordSolver>;
  updateSolver(
    graphs: GraphPartitions,
    moves: [NodeName, NodeName, number][],
  ): GraphSolver;
  startStreamingCriticalWordsInfo(
    callback: (data: {
      move: [NodeName, NodeName];
      difference: Record<"win" | "lose" | "loopwin", NodeName[]>;
    }) => void,
    graph: BipartiteDiGraph,
    view: NodePos,
  ): void;
  startStreamingSingleThreadSearch(
    callback: (
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
    ) => void,
    graph: BipartiteDiGraph,
    move: SingleMove,
    precRule: number,
    precMaps: PrecedenceMaps,
  ): void;
  searchIsWin(
    graph: BipartiteDiGraph,
    move: SingleMove,
    precRule: number,
    precMaps: PrecedenceMaps,
  ): { isWin: boolean; duration: number };
};

const funcWorkerApi: FuncWorkerApi = {
  async getWcData(rule: RuleForm): Promise<WordSolver> {
    let start, end;
    start = performance.now();

    const words = await loadWords(rule.wordRule);
    end = performance.now();

    start = performance.now();

    const { manner, addedWords, removedWords } = rule.postprocessing;

    const [headIdx, tailIdx] = [
      getIdx(
        rule.wordConnectionRule.rawHeadIdx,
        rule.wordConnectionRule.headDir,
      ),
      getIdx(
        rule.wordConnectionRule.rawTailIdx,
        rule.wordConnectionRule.tailDir,
      ),
    ];
    const changeFunc = sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx];

    const wordMap = WordMap.fromWords(words, headIdx, tailIdx);
    let graph: BipartiteDiGraph = BipartiteDiGraph.fromWordMap(
      wordMap,
      changeFunc,
    );

    if (manner.type !== 0) {
      // 한방 단어 제거 설정 시
      if (manner.type !== 3) {
        let nodes0 = graph.getSinks(0);

        if (manner.type === 1) {
          // 한 번만 제거

          if (nodes0.length > 0) {
            for (const node of nodes0) {
              const [, inEdges] = graph.removeNode(0, node);
              for (const [start, end] of inEdges) wordMap.remove(start, end);
            }
            const nodes1 = graph.getSinks(1);

            for (const node of nodes1) {
              graph.removeNode(1, node);
            }
          }
        } else if (manner.type === 2) {
          // 모두 제거
          while (nodes0.length > 0) {
            for (const node of nodes0) {
              const [, inEdges] = graph.removeNode(0, node);
              for (const [start, end] of inEdges) wordMap.remove(start, end);
            }
            const nodes1 = graph.getSinks(1);
            for (const node of nodes1) {
              graph.removeNode(1, node);
            }
            nodes0 = graph.getSinks(0);
          }
        }
      } else {
        if (undefined === manner.nextWordsLimit)
          throw new Error("nextWordsLimit Error");

        const targets = graph.nextWordsLimitNodes(0, manner.nextWordsLimit);

        for (const node of targets) {
          const [, inEdges] = graph.removeNode(0, node);
          for (const [start, end] of inEdges) wordMap.remove(start, end);
        }

        const nodes1 = graph.getSinks(1);
        for (const node of nodes1) {
          graph.removeNode(1, node);
        }
      }
    }

    const removedWordsArr = removedWords
      .split(/\s+/)
      .filter((e) => e.length >= 1);
    const addedWordsArr = [
      ...new Set(addedWords.split(/\s+/).filter((e) => e.length >= 1)),
    ];
    if (removedWordsArr.length > 0 || addedWordsArr.length > 0) {
      for (const word of removedWordsArr) {
        const [start, end] = getHeadTail(word, headIdx, tailIdx);
        wordMap.removeWord(start, end, word);
      }
      for (const word of addedWordsArr) {
        const [start, end] = getHeadTail(word, headIdx, tailIdx);
        const arr = wordMap.get(start, end, []);
        if (!arr.includes(word)) {
          arr.push(word);
        }
      }

      graph = BipartiteDiGraph.fromWordMap(wordMap, changeFunc);
    }

    const solver = new WordSolver(graph, wordMap, headIdx, tailIdx);

    end = performance.now();
    console.log({ time: end - start });
    return solver;
  },
  updateSolver(graphs: GraphPartitions, moves: [NodeName, NodeName, number][]) {
    graphs = GraphPartitions.fromObj(graphs);

    const graph = graphs.updateUnion("winlose");

    for (const [start, end, num] of moves) {
      graph.decreaseEdge(start, end, num);
    }

    const solver = new GraphSolver(graph);

    return solver;
  },
  startStreamingCriticalWordsInfo(
    callback: (data: {
      move: [NodeName, NodeName];
      difference: Record<"win" | "lose" | "loopwin", NodeName[]>;
    }) => void,
    graph: BipartiteDiGraph,
    view: NodePos,
  ) {
    graph = BipartiteDiGraph.fromObj(graph);

    const criticalEdges = graph.getCriticalEdges();

    for (const [start, end] of criticalEdges) {
      const removedGraph = graph.copy();
      removedGraph.decreaseEdge(start, end, 1);
      const { typeMap } = classify(removedGraph);
      const typeMapOnView = typeMap[view];

      const nodeInfo: Record<"win" | "lose" | "loopwin", NodeName[]> = {
        win: [],
        lose: [],
        loopwin: [],
      };

      for (const [node, type] of Object.entries(typeMapOnView)) {
        if (type !== "route") {
          nodeInfo[type as "win" | "lose"].push(node);
        }
      }

      callback({
        move: [start, end],
        difference: nodeInfo,
      });
    }
  },
  startStreamingSingleThreadSearch(
    callback: (
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
    ) => void,
    graph: BipartiteDiGraph,
    move: SingleMove,
    precRule: number,
    precMap: PrecedenceMaps,
  ) {
    graph = BipartiteDiGraph.fromObj(graph);

    const start = performance.now();

    const stack: SingleMove[] = [];
    const maxBranch: (SingleMove[] | undefined)[] = [];

    const throttledPostStack = throttle(
      () =>
        callback({
          action: "stack",
          payload: stack,
        }),
      1000,
      { leading: true, trailing: false }, // 첫 호출은 즉시, 이후 1초간 호출 무시
    );

    const win = isWin(graph, move, precRule, precMap, ({ action, data }) => {
      if (action === "push") {
        stack.push(data);
      } else if (action === "pop") {
        const move: SingleMove = stack.pop()!;
        if (data === "win") {
          const branch = [...(maxBranch[stack.length + 1] || []), move];
          maxBranch[stack.length + 1] = undefined;
          maxBranch[stack.length] = branch;
        } else {
          const branch = [...(maxBranch[stack.length + 1] || []), move];
          maxBranch[stack.length + 1] = undefined;
          if (
            !maxBranch[stack.length] ||
            maxBranch[stack.length]!.length < branch.length
          ) {
            maxBranch[stack.length] = branch;
          }
        }
      }

      throttledPostStack();
    });

    throttledPostStack.cancel();

    const end = performance.now();
    callback({
      action: "done",
      payload: {
        isWin: !win,
        duration: round((end - start) / 1000, 2),
        optimalPath: maxBranch[0]!.reverse(),
      },
    });
  },
  searchIsWin(
    graph: BipartiteDiGraph,
    move: SingleMove,
    precRule,
    precMap,
  ): { isWin: boolean; duration: number } {
    graph = BipartiteDiGraph.fromObj(graph);
    const start = performance.now();
    const win = isWin(graph, move, precRule, precMap);
    const end = performance.now();
    return { isWin: !win, duration: end - start };
  },
};

Comlink.expose(funcWorkerApi);

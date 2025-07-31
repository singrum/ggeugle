import { compareEdge } from "@/lib/utils";
import type { ChangeFunc } from "@/types/rule";
import type { MoveClass, MoveRow, MoveType, WordsCard } from "@/types/search";
import { range } from "lodash";
import { EdgeCounter } from "../classes/edge-counter";
import { EdgeMap } from "../classes/edge-map";
import { hasDepthMap, moveTypeToWordVariant } from "../constants";
import { BipartiteDiGraph } from "../graph/bipartite-digraph";
import type { NodeName, NodePos } from "../graph/graph";
import { GraphSolver } from "../graph/graph-solver";
import { WordMap } from "./word-map";

export class WordSolver {
  graphSolver: GraphSolver;
  wordMap: WordMap;
  headIdx: number;
  tailIdx: number;

  constructor(
    graph: BipartiteDiGraph,
    wordMap: WordMap,
    headIdx: number,
    tailIdx: number,
  ) {
    this.graphSolver = new GraphSolver(graph);
    this.wordMap = wordMap;
    this.headIdx = headIdx;
    this.tailIdx = tailIdx;
  }
  static fromObj(obj: WordSolver): WordSolver {
    const result = Object.create(WordSolver.prototype);
    const { graphSolver, wordMap, headIdx, tailIdx } = obj;
    Object.assign(result, {
      graphSolver: GraphSolver.fromObj(graphSolver),
      wordMap: WordMap.fromWordMap(wordMap),
      headIdx,
      tailIdx,
    });

    return result;
  }

  moveClassToWordsCards(moveClass: MoveClass): WordsCard[] {
    const result: WordsCard[] = [];
    for (const moveType in moveClass) {
      const moveInfo = moveClass[moveType];
      const temp: WordsCard[] = [];
      const hasDepth = hasDepthMap[moveType];

      for (const [depth, moveInfoMap] of Object.entries(moveInfo)) {
        const card: WordsCard = {
          moveType: Number(moveType) as MoveType,
          depth: hasDepth ? Number(depth) : undefined,
          moveRows: moveInfoMap.toArray().map(
            ([head, tail, { nodeTypes, wordIdx, pairs }]) =>
              ({
                move: [head, tail],
                nodeTypes: [nodeTypes[0], nodeTypes[1]],
                words: wordIdx.map(
                  (i) => (this.wordMap.get(head, tail) || [])[i],
                ),
                ...(pairs
                  ? {
                      pairs: pairs.map(([pairHead, pairTail, pairIdx]) =>
                        this.wordMap.getWord(pairHead, pairTail, pairIdx),
                      ),
                    }
                  : {}),
              }) as MoveRow,
          ),
        };
        card.moveRows.sort((a, b) => compareEdge(a.move, b.move));
        temp.push(card);
      }
      temp.sort((a, b) => {
        if (hasDepthMap[moveType]) {
          return moveTypeToWordVariant[moveType] === "win"
            ? a.depth! - b.depth!
            : -a.depth! + b.depth!;
        }
        return 1;
      });
      result.push(...temp);
    }
    return result;
  }

  getWordsCardsFromChar(
    char: NodeName,
    view: NodePos,
    direction: NodePos,
    changeFunc?: ChangeFunc,
  ): WordsCard[] {
    const moves = this.graphSolver.graphs.getMovesFromNode(
      char,
      view,
      direction,
      changeFunc,
    );

    const indexMap: EdgeMap<number[]> = new EdgeMap();

    for (const move of moves) {
      indexMap.set(
        move[0],
        move[1],
        range(...this.graphSolver.graphs.getEdgeIdxRange(move[0], move[1])),
      );
    }

    const moveClass = this.graphSolver.classifyMoves(indexMap);

    const result = this.moveClassToWordsCards(moveClass);
    return result;
  }
  getSccData(
    view: NodePos,
    asc: boolean,
  ): {
    nodes: NodeName[];
    succ: { nodes: NodeName[]; by: string[] }[];
  }[] {
    const data = this.graphSolver.getSccData(view, asc);

    return data.map(({ nodes, succ }) => ({
      nodes,
      succ: succ.map(({ nodes, by }) => ({
        nodes,
        by: by
          .map(([start, end, range]) =>
            (this.wordMap.get(start, end) || []).slice(...range),
          )
          .flat(),
      })),
    }));
  }
  getNextWords(words: string[]): string[] {
    const wordMap = this.wordMap;
    let nextWords: string[];
    if (words.length === 0) {
      nextWords = wordMap.getAllWords();
    } else {
      const wordSet: Set<string> = new Set(words);
      const start = words.at(-1)!.at(this.tailIdx)!;

      nextWords = this.graphSolver.graphs
        .getMovesFromNode(start, 0, 0)
        .map((e) => wordMap.get(e[0], e[1]) ?? [])
        .flat()
        .filter((e) => !wordSet.has(e));
    }
    return nextWords;
  }

  getLoseWordsFile(view: NodePos): {
    char: NodeName;
    words: WordsCard[];
  }[] {
    const nodes = this.graphSolver
      .getWinloseNodes("lose", view)
      .map((e) => e.nodes)
      .flat()
      .sort();

    const result = nodes.map((e) => {
      const cards = this.getWordsCardsFromChar(e, view, 0);
      return {
        char: e,
        words: cards,
      };
    });
    return result;
  }
  getEssentialWinWordFile(
    view: NodePos,
  ): { char: NodeName; words: WordsCard }[] {
    const nodes = [
      ...this.graphSolver
        .getWinloseNodes("win", view)
        .map((e) => e.nodes)
        .flat(),
      ...this.graphSolver
        .getWinloseNodes("loopwin", view)
        .map((e) => e.nodes)
        .flat(),
    ];
    nodes.sort();

    const result = nodes.map((e) => ({
      char: e,
      words: this.getWordsCardsFromChar(e, view, 0).filter(
        (e) => moveTypeToWordVariant[e.moveType] === "win",
      )[0],
    }));

    return result;
  }

  getDistinctRouteWords(moves: [NodeName, NodeName][]): string[] {
    const counter = new EdgeCounter();
    const words: string[] = [];

    for (const [start, end] of moves) {
      if (start === "__none") {
        words.push(end);
      } else {
        const [, offset] = this.graphSolver.graphs.getEdgeNumAndOffet(
          start,
          end,
          "route",
        );
        const idx = offset + counter.get(start, end);
        const targets = this.wordMap.get(start, end);
        if (!targets) {
          return [];
        }

        words.push(targets[idx]);

        counter.increase(start, end);
      }
    }
    return words;
  }
  getWinWordsFile(view: NodePos): {
    char: NodeName;
    info: { depth: number; words: string[] }[];
  }[] {
    const winChars = this.graphSolver
      .getWinloseNodes("win", view)
      .map((e) => e.nodes)
      .flat()
      .sort();
    const result: ReturnType<typeof this.getWinWordsFile> = [];
    for (const node of winChars) {
      const cards = this.getWordsCardsFromChar(node, view, 0);
      const info: { depth: number; words: string[] }[] = [];
      for (const card of cards) {
        if (card.moveType !== 0) {
          break;
        }
        const words = card.moveRows.map((e) => e.words).flat();
        info.push({ depth: card.depth!, words });
      }
      result.push({ char: node, info });
    }
    return result;
  }
  getBangdanFile(view: NodePos): {
    char: NodeName;
    info: { depth: number | undefined; words: string[] }[];
  }[] {
    const loseChars = this.graphSolver
      .getWinloseNodes("lose", view)
      .map((e) => e.nodes)
      .flat()
      .sort();
    const result: ReturnType<typeof this.getBangdanFile> = [];
    for (const node of loseChars) {
      const cards = this.getWordsCardsFromChar(node, view, 0);
      const info: { depth: number | undefined; words: string[] }[] = []; // undefined 일 때 돌림단어
      for (const card of cards) {
        const words = card.moveRows.map((e) => e.words).flat();
        info.push({ depth: card.depth!, words });
      }
      if (info.length > 0) {
        result.push({ char: node, info });
      }
    }
    return result;
  }
  getEssentialWinWordsFile(view: NodePos): { char: NodeName; word: string }[] {
    const winChars = this.graphSolver
      .getWinloseNodes("win", view)
      .map((e) => e.nodes)
      .flat()
      .sort();
    const result: ReturnType<typeof this.getEssentialWinWordsFile> = [];
    for (const char of winChars) {
      const [start, end] = this.graphSolver.getWinningOptimalMove(view, char);
      const [startIdx] = this.graphSolver.graphs.getEdgeIdxRange(
        start,
        end,
        "winlose",
      );
      const word = this.wordMap.getWord(start, end, startIdx)!;
      result.push({ char, word });
    }
    return result;
  }
  getRouteWordsFile(
    view: NodePos,
    type: 0 | 1, // 주요/희귀 여부
  ): { char: NodeName; words: string[] }[] {
    const routeChars = this.graphSolver.getRouteNodes(view)[type];
    const result: ReturnType<typeof this.getRouteWordsFile> = [];
    for (const char of routeChars) {
      const words = this.graphSolver.graphs
        .getMovesFromNode(char, view, 0, undefined, ["route"])
        .map(([start, end]) =>
          range(
            ...this.graphSolver.graphs.getEdgeIdxRange(start, end, "route"),
          ).map((idx) => this.wordMap.getWord(start, end, idx)!),
        )
        .flat();

      result.push({ char, words });
    }
    return result;
  }
  getRemovedWordsFile(): [string, string][] {
    const removedEdges = this.graphSolver.graphs.getGraph("removed").edges(1);
    const pairs: [
      [NodeName, NodeName, number],
      [NodeName, NodeName, number],
    ][] = [];
    for (const [start, end, num] of removedEdges) {
      for (let i = 0; i < num; i++) {
        pairs.push([
          [start, end, i],
          this.graphSolver.pairManager.getPairIdx(start, end, i)!,
        ]);
      }
    }
    const wordPairs: [string, string][] = pairs.map(
      (e) =>
        range(2).map(
          (i) => this.wordMap.getWord(e[i][0], e[i][1], e[i][2])!,
        ) as [string, string],
    );
    return wordPairs.sort((a, b) => a[0].localeCompare(b[0]));
  }
}

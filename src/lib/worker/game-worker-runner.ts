import { ComlinkRunner } from "@/lib/worker/comlink-runner";
import { default as FuncWorker } from "@/lib/worker/func-worker?worker";
import type { PrecInfo } from "@/types/search";
import { range, round, sample, shuffle } from "lodash";
import { getHeadTail, truncate } from "../utils";
import { EdgeCounter } from "../wordchain/classes/edge-counter";
import { EdgeMap } from "../wordchain/classes/edge-map";
import type { NodeName } from "../wordchain/graph/graph";
import {
  GraphSolver,
  normalizeNodeType,
} from "../wordchain/graph/graph-solver";
import { WordMap } from "../wordchain/word/word-map";
import type { WordSolver } from "../wordchain/word/word-solver";
import type { FuncWorkerApi } from "./func-worker";

export type GameWorkerRunnerOnmessageData =
  | {
      action: "debug";
      payload: string;
    }
  | {
      action: "move";
      payload: string;
    }
  | { action: "computerWin" }
  | { action: "messageEnd" };

export class GameWorkerRunner {
  private solver: WordSolver;
  private difficulty: 0 | 1 | 2;
  private calculatingDuration: number;
  private stealable: boolean;
  private prec: PrecInfo;
  private historyWordMap: WordMap;
  private currChar: undefined | NodeName;
  private comlinkRunner: ComlinkRunner<FuncWorkerApi>;
  private historyNum: number;
  private callback: (e: GameWorkerRunnerOnmessageData) => void;
  id: string;
  constructor(
    solver: WordSolver,
    difficulty: 0 | 1 | 2,
    calculatingDuration: number,
    stealable: boolean,
    history: string[],
    prec: PrecInfo,
    callback: (e: GameWorkerRunnerOnmessageData) => void,
    id: string,
  ) {
    this.id = id;
    this.solver = solver;
    this.difficulty = difficulty;
    this.calculatingDuration = calculatingDuration;
    this.stealable = stealable;
    this.historyNum = history.length;
    this.historyWordMap = WordMap.fromWords(
      [...new Set(history)],
      solver.headIdx,
      solver.tailIdx,
    );
    this.currChar = history.at(-1)?.at(this.solver.tailIdx);

    this.prec = prec;

    this.comlinkRunner = new ComlinkRunner(FuncWorker);
    this.callback = callback;
  }

  async run(flow: number) {
    const historyNum = this.historyWordMap
      .toArray()
      .reduce((prev, curr) => prev + curr.length, 0);

    let resultMove: [NodeName, NodeName];
    if (this.difficulty === 0) {
      const word = this.getRandomNextWord();

      this.takeMove(word);
      return;
    } else {
      if (historyNum === 0) {
        if (this.difficulty === 1) {
          // 난이도 : 보통일 때 첫 수
          this.takeRandomRouteWord();
          return;
        } else {
          /// 난이도 : 어려움일 때 첫 수
          await this.takeDragingWord();
          return;
        }
      } else {
        const updatedSolver = await this.getNextSolver(flow);
        const nodeType = normalizeNodeType(
          updatedSolver.getNodeType(this.currChar!, 0),
        );

        if (nodeType === "win" || nodeType === "lose") {
          if (nodeType === "lose" && this.checkSteal()) {
            return;
          }
          const word = this.getShallowOptimalWord(updatedSolver, nodeType);

          this.takeMove(word);
          return;
        } else {
          this.callback({
            action: "debug",
            payload: `### ${this.currChar} : 루트 음절  \n`,
          });

          const routeMoves = updatedSolver.graphs
            .getGraph("route")
            .getMovesFromNode(this.currChar!, 0, 0)
            .sort((a, b) => {
              return updatedSolver.graphs
                .getGraph("route")
                .compareNextMoveNum(a, b, this.prec);
            });

          resultMove = sample(routeMoves)!;
          const resultWord = this.getWord(resultMove);

          if (this.difficulty === 1) {
            [
              `### 랜덤 루트 음절 제시  \n`,
              `후보: ${truncate(
                routeMoves,
                ([start, end]) => `(${start},${end})`,
              )}  \n`,
              `결과 : ${resultWord}`,
            ].map((e) =>
              this.callback({
                action: "debug",
                payload: e,
              }),
            );

            this.takeMove(resultWord!);
            return;
          } else {
            const durations: number[] = [];
            for await (const move of routeMoves) {
              this.callback({
                action: "debug",
                payload: `(${move}) 탐색`,
              });

              try {
                const { isWin, duration } =
                  await this.comlinkRunner.callAndTerminate(
                    "searchIsWin",
                    [updatedSolver.graphs.getGraph("route"), move, this.prec],
                    this.calculatingDuration * 1000,
                  );
                if (isWin) {
                  this.callback({
                    action: "debug",
                    payload: `→ 승 (${round(duration / 1000, 2)}초)  \n`,
                  });
                  const word = this.getWord(move);
                  this.callback({
                    action: "debug",
                    payload: `결과 : ${word}`,
                  });

                  this.takeMove(word!);
                  return;
                } else {
                  durations.push(duration);
                  this.callback({
                    action: "debug",
                    payload: ` → 패 (${round(duration / 1000, 2)}초)  \n`,
                  });
                }
              } catch {
                this.callback({
                  action: "debug",
                  payload: " → 알 수 없음  \n",
                });
                const word = this.getWord(move);

                this.takeMove(word!);
                return;
              }
            }
            this.callback({ action: "debug", payload: "필패 확정  \n" });
            if (this.checkSteal()) {
              return;
            }
            const optimalMove =
              routeMoves[
                range(routeMoves.length).reduce(
                  (i, j) => (durations[j] < durations[i] ? i : j),
                  0,
                )
              ];
            const optimalWord = this.getWord(optimalMove);
            [`최적 수: (${optimalMove})  \n`, `결과: ${optimalWord}`].map((e) =>
              this.callback({
                action: "debug",
                payload: e,
              }),
            );

            this.takeMove(optimalWord);
          }
        }
      }
    }
  }
  takeMove(word: string) {
    this.callback({ action: "move", payload: word! });

    if (this.isHanbang(word)) {
      this.callback({ action: "computerWin" });
    }
    this.callback({ action: "messageEnd" });
    return;
  }
  currStealable() {
    return this.historyNum === 1 && this.stealable;
  }
  checkSteal(): boolean {
    if (!this.currStealable()) {
      return false;
    }
    const temp = this.historyWordMap.toArray()[0];
    const result = temp[2][0];
    [`### 단어 뺏기  \n`, `결과: ${result}`].map((e) =>
      this.callback({
        action: "debug",
        payload: e,
      }),
    );
    this.takeMove(result);
    return true;
  }
  getWord(move: [NodeName, NodeName]): string {
    return this.solver.wordMap
      .get(move[0], move[1])!
      .find(
        (e) =>
          this.currStealable() ||
          !(this.historyWordMap.get(move[0], move[1]) || []).includes(e),
      )!;
  }
  isLose(): boolean {
    if (!this.currChar) {
      return false;
    }

    const counter = this.getNextCounter(this.currChar);
    return counter.toArray().length === 0;
  }

  getNextMoves(): [NodeName, NodeName, number][] {
    if (!this.currChar) {
      return this.solver.graphSolver.graphs.union().edges(1);
    } else {
      const counter = this.getNextCounter(this.currChar);
      return counter.toArray();
    }
  }
  getNextCounter(char: NodeName) {
    const nextMoves: [NodeName, NodeName, number][] =
      this.solver.graphSolver.graphs
        .getMovesFromNode(char, 0, 0)
        .map((e) => [
          e[0],
          e[1],
          this.solver.graphSolver.graphs.getEdgeNumAndOffet(e[0], e[1])[0],
        ]);

    const nextCounter = EdgeCounter.fromEdgeMap(EdgeMap.fromArray(nextMoves));
    for (const [start, end, arr] of this.historyWordMap.toArray()) {
      if (nextCounter.get(start, end, arr.length) > 0)
        nextCounter.decrease(start, end, arr.length);
    }
    if (this.currStealable()) {
      const firstMove = this.historyWordMap.toArray()[0];
      nextCounter.increase(firstMove[0], firstMove[1]);
    }

    return nextCounter;
  }
  getFirstWord(): string {
    return this.historyWordMap.getAllWords()[0];
  }

  isHanbang(word: string) {
    const [head, tail] = getHeadTail(
      word,
      this.solver.headIdx,
      this.solver.tailIdx,
    );

    const counter = this.getNextCounter(tail);
    const historyNum = this.historyWordMap.getSize();

    if (this.stealable && historyNum === 0) {
      return false;
    }

    for (const [start, end, num] of this.historyWordMap.toArray()) {
      if (counter.get(start, end) > 0) counter.decrease(start, end, num.length);
    }

    if (
      counter.get(head, tail) > 0 &&
      (!this.stealable || historyNum !== 1 || word !== this.getFirstWord())
    ) {
      return counter.decrease(head, tail);
    }

    return counter.toArray().length === 0;
  }
  getRandomNextWord() {
    const nextMoves = this.getNextMoves();
    const [start, end] = sample(nextMoves)!;

    const result = this.getWord([start, end]);
    [
      `### 랜덤 단어  \n`,
      `후보: ${truncate(
        nextMoves,
        ([start, end, num]) => `(${start},${end},${num})`,
      )}  \n`,
      `결과: ${result}`,
    ].map((e) =>
      this.callback({
        action: "debug",
        payload: e,
      }),
    );
    return result;
  }
  async getNextSolver(flow: number): Promise<GraphSolver> {
    return GraphSolver.fromObj(
      await this.comlinkRunner.callAndTerminate("updateSolver", [
        this.solver.graphSolver.graphs,
        this.historyWordMap
          .toArray()
          .map(
            (e) => [e[0], e[1], e[2].length] as [NodeName, NodeName, number],
          ),
        flow,
      ]),
    );
  }
  getShallowOptimalWord(
    nextSolver: GraphSolver,
    nodeType: "win" | "lose",
  ): string {
    const resultMove =
      nodeType === "win"
        ? nextSolver.getWinningOptimalMove(0, this.currChar!)
        : nextSolver.getLosingOptimalMove(0, this.currChar!) ||
          nextSolver.graphs.getMovesFromNode(this.currChar!, 0, 0)[0];

    const result = this.getWord(resultMove);
    [
      `### ${this.currChar} : ${nodeType === "win" ? "승리 음절" : "패배 음절"}  \n`,
      `최적 수: (${resultMove[0]},${resultMove[1]})  \n`,
      `결과: ${result}`,
    ].map((e) =>
      this.callback({
        action: "debug",
        payload: e,
      }),
    );
    return result;
  }
  takeRandomRouteWord() {
    const graph = this.solver.graphSolver.graphs.getGraph("route");
    const moves = graph.edges(1);

    if (moves.length > 0) {
      const [start, end] = sample(moves) as [NodeName, NodeName, number];
      const word: string = this.getWord([start, end]);
      [
        `### 랜덤 루트 단어  \n`,
        `후보: ${truncate(
          moves,
          ([start, end, num]) => `(${start},${end},${num})`,
        )}  \n`,
        `결과: ${word}`,
      ].forEach((e) =>
        this.callback({
          action: "debug",
          payload: e,
        }),
      );

      this.takeMove(word);
    } else {
      const entries = Array.from(this.solver.graphSolver.depthMap[1].entries());
      const maxNode = entries.reduce(
        (prev, curr) =>
          this.solver.graphSolver.depthMap[1].get(prev)! < curr[1]
            ? curr[0]
            : prev,
        entries[0][0],
      );
      [`### 루트 단어 없음 \n`].forEach((e) =>
        this.callback({
          action: "debug",
          payload: e,
        }),
      );
      const optimalMove =
        normalizeNodeType(this.solver.graphSolver.getNodeType(maxNode, 1)) ===
        "win"
          ? this.solver.graphSolver.getWinningOptimalMove(1, maxNode)
          : this.solver.graphSolver.getLosingOptimalMove(1, maxNode);
      const word = this.getWord(optimalMove!);
      [
        `### 깊이가 최대인 단어\n`,
        `(${optimalMove!}) \n`,
        `결과: ${this.getWord(optimalMove!)}`,
      ].forEach((e) =>
        this.callback({
          action: "debug",
          payload: e,
        }),
      );

      this.takeMove(word);
    }
  }
  async takeDragingWord() {
    const routeGrapah = this.solver.graphSolver.graphs.getGraph("route");
    const moves = shuffle(routeGrapah.edges(1));
    if (moves.length > 0) {
      const durations: number[] = [];

      for await (const [start, end] of moves) {
        this.callback({
          action: "debug",
          payload: `(${start},${end}) 탐색`,
        });

        try {
          const { isWin, duration } = await this.comlinkRunner.callAndTerminate(
            "searchIsWin",
            [
              this.solver.graphSolver.graphs.getGraph("route"),
              [start, end],
              this.prec,
            ],
            this.calculatingDuration * 1000,
          );
          if (isWin) {
            durations.push(duration);
            this.callback({
              action: "debug",
              payload: `→ 승 (${round(duration / 1000, 2)}초)  \n`,
            });
          } else {
            durations.push(duration);
            this.callback({
              action: "debug",
              payload: ` → 패 (${round(duration / 1000, 2)}초)  \n`,
            });
          }
        } catch {
          this.callback({
            action: "debug",
            payload: " → 알 수 없음  \n",
          });
          const word = this.getWord([start, end]);

          this.takeMove(word!);
          return;
        }
      }
      this.callback({ action: "debug", payload: "필패 확정  \n" });

      const optimalMove =
        moves[
          range(moves.length).reduce(
            (i, j) => (durations[j] < durations[i] ? i : j),
            0,
          )
        ];
      const optimalWord = this.getWord([optimalMove[0], optimalMove[1]]);
      [`최적 수: (${optimalMove})  \n`, `결과: ${optimalWord}`].map((e) =>
        this.callback({
          action: "debug",
          payload: e,
        }),
      );

      this.takeMove(optimalWord);
    } else {
      const entries = Array.from(this.solver.graphSolver.depthMap[1].entries());
      const maxNode = entries.reduce(
        (prev, curr) =>
          this.solver.graphSolver.depthMap[1].get(prev)! < curr[1]
            ? curr[0]
            : prev,
        entries[0][0],
      );
      [`### 루트 단어 없음 \n`].forEach((e) =>
        this.callback({
          action: "debug",
          payload: e,
        }),
      );
      const optimalMove =
        normalizeNodeType(this.solver.graphSolver.getNodeType(maxNode, 1)) ===
        "win"
          ? this.solver.graphSolver.getWinningOptimalMove(1, maxNode)
          : this.solver.graphSolver.getLosingOptimalMove(1, maxNode);
      const word = this.getWord(optimalMove!);
      [
        `### 깊이가 최대인 단어\n`,
        `(${optimalMove!}) \n`,
        `결과: ${this.getWord(optimalMove!)}`,
      ].forEach((e) =>
        this.callback({
          action: "debug",
          payload: e,
        }),
      );

      this.takeMove(word);
    }
  }
  terminate() {
    this.comlinkRunner.terminate();
  }
}

// 1. getPositionInfo
// 2. getDeepSearchInfo 반복

// class Position {
//   originalSolver: WordSolver;
//   historyWordMap: WordMap;
//   currChar: string | undefined;
//   stealable: boolean;
//   constructor(
//     originalSolver: WordSolver,
//     historyWordMap: WordMap,
//     currChar: string | undefined,
//     stealable: boolean,
//   ) {
//     this.originalSolver = originalSolver;
//     this.historyWordMap = historyWordMap;
//     this.currChar = currChar;
//     this.stealable = stealable;
//   }
//   getNextMoves(): [NodeName, NodeName, number][] {
//     if (!this.currChar) {
//       return this.originalSolver.graphSolver.graphs.union().edges(1);
//     }
//     if (this.historyWordMap.getSize() === 1 && this.stealable) {
//       const moves = this.originalSolver.graphSolver.graphs
//         .getMovesFromNode(this.currChar, 0, 0)
//         .map(
//           (e) =>
//             [
//               e[0],
//               e[1],
//               this.originalSolver.graphSolver.graphs.getEdgeNumAndOffet(
//                 e[0],
//                 e[1],
//               )[0],
//             ] as [string, string, number],
//         );
//       return moves;
//     }
//   }

//   isLose() {
//     // 첫수
//     if (!this.currChar) {
//       // 단어가 아예 없음
//       return this.originalSolver.wordMap.getSize() === 0;
//     } else {
//       if (this.historyWordMap.getSize() === 1 && this.stealable)
//         this.originalSolver.graphSolver.graphs.getMovesFromNode(
//           this.currChar,
//           0,
//           0,
//         );
//     }
//   }
// }

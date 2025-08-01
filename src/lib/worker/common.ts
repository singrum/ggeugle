import type { PrecedenceMaps } from "@/types/search";
import { BipartiteDiGraph } from "../wordchain/graph/bipartite-digraph";
import { pruneWinLoseNodes } from "../wordchain/graph/classify";
import type {
  NodeName,
  NormalizedNodeType,
  SingleMove,
} from "../wordchain/graph/graph";
import { GraphPartitions } from "../wordchain/graph/graph-partitions";
import {
  GraphSolver,
  normalizeNodeType,
} from "../wordchain/graph/graph-solver";
export type SearchCallbackParameter =
  | { action: "push"; data: SingleMove }
  | { action: "pop"; data: "win" | "lose" };

export function getPositionInfo(
  graphs: GraphPartitions,
  history: [NodeName, NodeName, number][],
  currChar: NodeName | undefined,
):
  | {
      type: "win" | "lose";
      optimalMove: SingleMove;
    }
  | { type: "route" | "empty"; nextMoves: SingleMove[] } {
  graphs = GraphPartitions.fromObj(graphs);

  const graph = graphs.updateUnion("winlose");

  for (const [start, end, num] of history) {
    graph.decreaseEdge(start, end, num);
  }

  const solver = new GraphSolver(graph);

  if (!currChar || history.length === 0) {
    return {
      type: "empty",
      nextMoves: solver.graphs
        .getGraph("route")
        .edges(1)
        .map(([start, end]) => [start, end]),
    };
  } else {
    const type: NormalizedNodeType = normalizeNodeType(
      solver.typeMap[0][currChar],
    );
    if (type === "win") {
      return { type, optimalMove: solver.getWinningOptimalMove(0, currChar) };
    } else if (type === "lose") {
      const losingOptimalMove = solver.graphs
        .getGraph("winlose")
        .getMovesFromNode(currChar, 0, 0)
        .filter(([start, end]) => {
          return end !== solver.loopMap[start];
        })
        .map((e) => [e[0], e[1]] as [NodeName, NodeName])
        .sort((a, b) => {
          return -solver.depthMap[0][a[1]] + solver.depthMap[0][b[1]];
        })[0];
      return { type, optimalMove: losingOptimalMove };
    } else {
      const nextMoves = graph.getMovesFromNode(currChar, 0, 0);
      return { type, nextMoves };
    }
  }
}

export function checkInitialCondition(graph: BipartiteDiGraph, node: NodeName) {
  const graphs: GraphPartitions = new GraphPartitions(
    {
      route: graph,
      winlose: new BipartiteDiGraph(),
      removed: new BipartiteDiGraph(),
    },
    ["removed", "winlose", "route"],
  );
  let { typeMap } = pruneWinLoseNodes(graphs);
  if (typeMap[0][node]) {
    const type = normalizeNodeType(typeMap[0][node]);
    if (type === "win") {
      return "win";
    } else {
      return "lose";
    }
  }

  const evenLoops = graphs.getGraph("route").getEvenLoops();
  evenLoops.map(([start, end, num]) =>
    graphs.transferEdge("route", "removed", start, end, num),
  );
  const twoCycles = graphs.getGraph("route").getTwoCycles();

  twoCycles.map((e) => {
    graphs.transferEdge("route", "removed", e[0][0], e[0][1], e[2]);
    graphs.transferEdge("route", "removed", e[1][0], e[1][1], e[2]);
  });
  ({ typeMap } = pruneWinLoseNodes(graphs));

  if (typeMap[0][node]) {
    const type = normalizeNodeType(typeMap[0][node]);
    if (type === "win") {
      return "win";
    } else {
      return "lose";
    }
  }
  return "route";
}

// graph에서 move를 취한 다음 턴의 상태 (win, lose)
export function isWin(
  graph: BipartiteDiGraph,
  move: SingleMove,
  precRule: number,
  precMap: PrecedenceMaps,
  callback?: (e: SearchCallbackParameter) => void,
): boolean {
  if (callback) {
    callback({ action: "push", data: move });
  }

  graph = graph.getReachableGraph(0, move[1]);
  if (graph.getEdgeNum(move[0], move[1]) >= 1) {
    graph.decreaseEdge(move[0], move[1]);
  }

  const type = checkInitialCondition(graph, move[1]);

  if (type === "win") {
    if (callback) {
      callback({ action: "pop", data: "win" });
    }
    return true;
  } else if (type === "lose") {
    if (callback) {
      callback({ action: "pop", data: "lose" });
    }
    return false;
  }

  // move = 업시름 -> 승
  // nextMoves = [늠준 -> 패, 늠균 -> 승]

  const nextMoves = graph
    .getMovesFromNode(move[1], 0, 0)
    .sort((a, b) => graph.compareNextMoveNum(a, b, precRule, precMap));

  for (const [start, end] of nextMoves) {
    if (!isWin(graph, [start, end], precRule, precMap, callback)) {
      if (callback) {
        callback({ action: "pop", data: "lose" });
      }
      return true;
    }
  }
  if (callback) {
    callback({ action: "pop", data: "win" });
  }
  return false;
}

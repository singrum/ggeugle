import type { PrecInfo } from "@/types/search";
import { BipartiteDiGraph } from "../wordchain/graph/bipartite-digraph";
import { pruneWinLoseNodes } from "../wordchain/graph/classify";
import type { NodeName, SingleMove } from "../wordchain/graph/graph";
import { GraphPartitions } from "../wordchain/graph/graph-partitions";
import { normalizeNodeType } from "../wordchain/graph/graph-solver";
export type SearchCallbackParameter =
  | { action: "push"; data: SingleMove }
  | { action: "pop"; data: "win" | "lose" };

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
  if (typeMap[0].has(node)) {
    const type = normalizeNodeType(typeMap[0].get(node)!);
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

  if (typeMap[0].has(node)) {
    const type = normalizeNodeType(typeMap[0].get(node)!);
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
  prec: PrecInfo,
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
    .sort((a, b) => graph.compareNextMoveNum(a, b, prec));

  for (const [start, end] of nextMoves) {
    if (!isWin(graph, [start, end], prec, callback)) {
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

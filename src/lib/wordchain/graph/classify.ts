import { BipartiteDiGraph, getOppos } from "./bipartite-digraph";
import type { NodeMap, NodeName, NodePos, NodeType, SingleMove } from "./graph";
import { GraphPartitions } from "./graph-partitions";

export function pruneWinLoseNodes(graphs: GraphPartitions): {
  typeMap: NodeMap<NodeType>;
  evenLoops: [NodeName, NodeName, number][];
  loopMap: Map<NodeName, NodeName>;
} {
  const evenLoops: [NodeName, NodeName, number][] = [];
  const typeMap: NodeMap<NodeType> = [new Map(), new Map()];
  const stack: [NodePos, NodeName][] = [];
  const loopMap: Map<NodeName, NodeName> = new Map();
  function getSeedType(pos: NodePos, name: NodeName): NodeType {
    if (pos === 0) {
      if (graphs.getGraph("route").outDegree(0, name) === 0) {
        return "lose";
      } else {
        return "route";
      }
    } else {
      const outdeg = graphs.getGraph("route").outDegree(1, name);
      if (outdeg >= 2) {
        return "route";
      } else if (outdeg === 0) {
        return "lose";
      } else {
        const succ = graphs.getGraph("route").successors(1, name)[0];
        if (
          graphs.getGraph("route").outDegree(0, succ) !== 1 ||
          graphs.getGraph("route").successors(0, succ)[0] !== name
        ) {
          return "route";
        }

        const num = graphs.getGraph("route").getEdgeNum(name, succ);
        const parity = num % 2;
        if (num - parity > 0) {
          graphs.transferEdge("route", "removed", name, succ, num - parity);
        }

        if (num >= 2) {
          evenLoops.push([name, succ, num - parity]);
        }
        if (parity === 1) {
          loopMap.set(name, succ);
          return "loopwin";
        } else {
          return "lose";
        }
      }
    }
  }
  function setSeeds() {
    const poses: NodePos[] = [0, 1];

    for (const pos of poses) {
      for (const node of graphs.getGraph("route").nodes(pos as NodePos)) {
        const nodeType = getSeedType(pos, node);
        if (nodeType !== "route") {
          typeMap[pos].set(node, nodeType);
          stack.push([pos, node]);
        }
      }
    }
  }

  setSeeds();

  while (stack.length > 0) {
    const [pos, name] = stack.pop()!;
    const oppos = getOppos(pos);

    const preds = graphs
      .getGraph("route")
      .predecessors(pos, name)
      .filter((e) => !typeMap[oppos].has(e));

    const type = typeMap[pos].get(name);
    graphs.transferNode("route", "winlose", pos, name);

    if (pos === 0) {
      if (type === "lose") {
        // 0 -> 1
        // type === "lose"
        for (const pred of preds) {
          typeMap[oppos].set(pred, "win");
          stack.push([oppos, pred]);
        }
      } else {
        // 0 -> 1
        // type === WIN | LOOPWIN
        for (const pred of preds) {
          const predType = getSeedType(oppos, pred);
          if (predType !== "route") {
            typeMap[oppos].set(pred, predType);
            stack.push([oppos, pred]);
          }
        }
      }
    } else {
      if (type === "lose") {
        // 1 -> 0
        // type === "lose"
        for (const pred of preds) {
          const predType = getSeedType(oppos, pred);
          if (predType !== "route") {
            typeMap[oppos].set(pred, "lose");
            stack.push([oppos, pred]);
          }
        }
      } else {
        // 1 -> 0
        // type === WIN | LOOPWIN

        for (const pred of preds) {
          typeMap[oppos].set(pred, type!);
          stack.push([oppos, pred]);
        }
      }
    }
  }

  return { typeMap, evenLoops, loopMap };
}

export function getDepthMap(
  graph: BipartiteDiGraph,
  typeMap: NodeMap<NodeType>,
): NodeMap<number> {
  const loseStack: [NodeName[], NodeName[]] = [[], []];
  const winStack: [NodeName[], NodeName[]] = [[], []];
  const outDegMap: NodeMap<number> = graph.getOutDegreeMap();
  const depthMap: NodeMap<number> = [new Map(), new Map()];
  function isSink(
    pos: NodePos,
    node: NodeName,
  ): "lose" | "loopwin" | undefined {
    if (typeMap[pos].get(node) === "lose" && outDegMap[pos].get(node) === 0) {
      return "lose";
    } else if (
      pos === 1 &&
      typeMap[pos].get(node) === "loopwin" &&
      outDegMap[pos].get(node) === 1
    ) {
      return "loopwin";
    }
  }
  function setSeeds() {
    const poses: NodePos[] = [0, 1];
    for (const pos of poses) {
      for (const node of graph.nodes(pos as NodePos)) {
        const type = isSink(pos, node);
        if (type === "lose") {
          loseStack[pos].push(node);
          depthMap[pos].set(node, 0);
        } else if (type === "loopwin") {
          winStack[pos].push(node);
          depthMap[pos].set(node, 1);
        }
      }
    }
  }

  setSeeds();
  // loseStack[1] -> loseStack[0] -> winStack[1] -> winStack[0]
  while (
    loseStack[1].length > 0 ||
    loseStack[0].length > 0 ||
    winStack[1].length > 0 ||
    winStack[0].length > 0
  ) {
    while (loseStack[1].length > 0) {
      const node = loseStack[1].pop()!;
      const preds = graph
        .predecessors(1, node)
        .filter((pred) => depthMap[0].get(pred) === undefined);
      for (const pred of preds) {
        outDegMap[0].set(pred, (outDegMap[0].get(pred) ?? 0) - 1);
        if (isSink(0, pred)) {
          loseStack[0].push(pred);
          depthMap[0].set(pred, depthMap[1].get(node)!);
        }
      }
    }
    while (loseStack[0].length > 0) {
      const node = loseStack[0].pop()!;
      const preds = graph
        .predecessors(0, node)
        .filter((pred) => depthMap[1].get(pred) === undefined);
      for (const pred of preds) {
        depthMap[1].set(pred, depthMap[0].get(node)! + 1);
        winStack[1].push(pred);
      }
    }
    while (winStack[1].length > 0) {
      const node = winStack[1].pop()!;
      const preds = graph
        .predecessors(1, node)
        .filter((pred) => depthMap[0].get(pred) === undefined);
      for (const pred of preds) {
        depthMap[0].set(pred, depthMap[1].get(node)!);
        winStack[0].push(pred);
      }
    }
    while (winStack[0].length > 0) {
      const node = winStack[0].pop()!;
      const preds = graph
        .predecessors(0, node)
        .filter((pred) => depthMap[1].get(pred) === undefined);
      for (const pred of preds) {
        outDegMap[1].set(pred, (outDegMap[1].get(pred) ?? 0) - 1);
        const type = isSink(1, pred);
        if (type === "lose") {
          loseStack[1].push(pred);
          depthMap[1].set(pred, depthMap[0].get(node)! + 1);
        } else if (type === "loopwin") {
          winStack[1].push(pred);
          depthMap[1].set(pred, depthMap[0].get(node)! + 2);
        }
      }
    }
  }
  return depthMap;
}
export function classify(
  graph: BipartiteDiGraph,
  flow: number,
): {
  graphs: GraphPartitions;
  evenLoops: [NodeName, NodeName, number][];
  twoCycles: [[NodeName, NodeName], [NodeName, NodeName], number][];
  typeMap: NodeMap<NodeType>;
  loopMap: Map<NodeName, NodeName>;
} {
  // const graphCopy: BipartiteDiGraph = graph.copy();
  const graphs = new GraphPartitions(
    {
      route: graph,
      winlose: new BipartiteDiGraph(),
      removed: new BipartiteDiGraph(),
    },
    ["removed", "winlose", "route"],
  );
  const loopMap: Map<NodeName, NodeName> = new Map();
  const evenLoops: [NodeName, NodeName, number][] = [];
  const twoCycles: [SingleMove, SingleMove, number][] = [];
  const typeMap: NodeMap<NodeType> = [new Map(), new Map()];

  function pruneWinloseInvolvingOneCycles(): boolean {
    const {
      typeMap: typeMap_,
      evenLoops: evenLoops_,
      loopMap: _loopMap,
    } = pruneWinLoseNodes(graphs);
    for (const pos of [0, 1] as NodePos[]) {
      for (const [k, v] of typeMap_[pos]) {
        typeMap[pos].set(k, v);
      }
    }
    evenLoops.push(...evenLoops_);
    for (const [k, v] of _loopMap.entries()) {
      loopMap.set(k, v);
    }

    // 새롭게 분류가 되었는가?

    return (
      typeMap_.some((e) => e.size > 0) ||
      evenLoops_.length > 0 ||
      _loopMap.size > 0
    );
  }
  function removeEvenLoops() {
    const evenLoops_ = graphs.getGraph("route").getEvenLoops();
    evenLoops_.map(([start, end, num]) =>
      graphs.transferEdge("route", "removed", start, end, num),
    );
    evenLoops.push(...evenLoops_);

    return evenLoops_.length > 0;
  }
  function removeTwoCycles() {
    const twoCycles_ = graphs.getGraph("route").getTwoCycles();

    twoCycles_.map((e) => {
      graphs.transferEdge("route", "removed", e[0][0], e[0][1], e[2]);
      graphs.transferEdge("route", "removed", e[1][0], e[1][1], e[2]);
    });

    twoCycles.push(...twoCycles_);
    return twoCycles_.length > 0;
  }

  let cnt = 0;
  let classified = true;

  if (flow === 0) {
    classified = true;
    while (cnt++ < 200 && classified) {
      // console.log("classifying loop : ", cnt);
      classified = false;
      classified = alwaysAssign(classified, pruneWinloseInvolvingOneCycles);
      classified = alwaysAssign(classified, removeEvenLoops);
      classified = alwaysAssign(classified, removeTwoCycles);
    }
  } else {
    classified = true;
    while (cnt++ < 200 && classified) {
      // console.log("classifying loop : ", cnt);
      classified = false;
      classified = alwaysAssign(classified, removeEvenLoops);
      classified = alwaysAssign(classified, removeTwoCycles);
      classified = alwaysAssign(classified, pruneWinloseInvolvingOneCycles);
    }
  }

  return { graphs, typeMap, evenLoops, twoCycles, loopMap };
}

function alwaysAssign(
  oldValue: boolean | null | undefined,
  fn: () => boolean,
): boolean {
  const result = fn();
  // oldValue가 truthy면 그대로 유지, 아니면 새 값 사용
  return oldValue || result;
}

import { BipartiteDiGraph, getOppos } from "./bipartite-digraph";
import type { NodeMap, NodeName, NodePos, NodeType, SingleMove } from "./graph";
import { GraphPartitions } from "./graph-partitions";

export function pruneWinLoseNodes(graphs: GraphPartitions): {
  typeMap: NodeMap<NodeType>;
  evenLoops: [NodeName, NodeName, number][];
  loopMap: Record<NodeName, NodeName>;
} {
  const evenLoops: [NodeName, NodeName, number][] = [];
  const typeMap: NodeMap<NodeType> = [{}, {}];
  const stack: [NodePos, NodeName][] = [];
  const loopMap: Record<NodeName, NodeName> = {};
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
          loopMap[name] = succ;
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
          typeMap[pos][node] = nodeType;
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
      .filter((e) => !typeMap[oppos][e]);

    const type = typeMap[pos][name];
    graphs.transferNode("route", "winlose", pos, name);

    if (pos === 0) {
      if (type === "lose") {
        // 0 -> 1
        // type === "lose"
        for (const pred of preds) {
          typeMap[oppos][pred] = "win";
          stack.push([oppos, pred]);
        }
      } else {
        // 0 -> 1
        // type === WIN | LOOPWIN
        for (const pred of preds) {
          const predType = getSeedType(oppos, pred);
          if (predType !== "route") {
            typeMap[oppos][pred] = predType;
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
            typeMap[oppos][pred] = "lose";
            stack.push([oppos, pred]);
          }
        }
      } else {
        // 1 -> 0
        // type === WIN | LOOPWIN

        for (const pred of preds) {
          typeMap[oppos][pred] = type;
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
  const depthMap: NodeMap<number> = [{}, {}];
  function isSink(
    pos: NodePos,
    node: NodeName,
  ): "lose" | "loopwin" | undefined {
    if (typeMap[pos][node] === "lose" && outDegMap[pos][node] === 0) {
      return "lose";
    } else if (
      pos === 1 &&
      typeMap[pos][node] === "loopwin" &&
      outDegMap[pos][node] === 1
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
          depthMap[pos][node] = 0;
        } else if (type === "loopwin") {
          winStack[pos].push(node);
          depthMap[pos][node] = 1;
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
        .filter((pred) => depthMap[0][pred] === undefined);
      for (const pred of preds) {
        outDegMap[0][pred] -= 1;
        if (isSink(0, pred)) {
          loseStack[0].push(pred);
          depthMap[0][pred] = depthMap[1][node];
        }
      }
    }
    while (loseStack[0].length > 0) {
      const node = loseStack[0].pop()!;
      const preds = graph
        .predecessors(0, node)
        .filter((pred) => depthMap[1][pred] === undefined);
      for (const pred of preds) {
        depthMap[1][pred] = depthMap[0][node] + 1;
        winStack[1].push(pred);
      }
    }
    while (winStack[1].length > 0) {
      const node = winStack[1].pop()!;
      const preds = graph
        .predecessors(1, node)
        .filter((pred) => depthMap[0][pred] === undefined);
      for (const pred of preds) {
        depthMap[0][pred] = depthMap[1][node];
        winStack[0].push(pred);
      }
    }
    while (winStack[0].length > 0) {
      const node = winStack[0].pop()!;
      const preds = graph
        .predecessors(0, node)
        .filter((pred) => depthMap[1][pred] === undefined);
      for (const pred of preds) {
        outDegMap[1][pred] -= 1;
        const type = isSink(1, pred);
        if (type === "lose") {
          loseStack[1].push(pred);
          depthMap[1][pred] = depthMap[0][node] + 1;
        } else if (type === "loopwin") {
          winStack[1].push(pred);
          depthMap[1][pred] = depthMap[0][node] + 2;
        }
      }
    }
  }
  return depthMap;
}
export function classify(graph: BipartiteDiGraph): {
  graphs: GraphPartitions;
  evenLoops: [NodeName, NodeName, number][];
  twoCycles: [[NodeName, NodeName], [NodeName, NodeName], number][];
  typeMap: NodeMap<NodeType>;
  loopMap: Record<NodeName, NodeName>;
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
  const loopMap: Record<NodeName, NodeName> = {};
  const evenLoops: [NodeName, NodeName, number][] = [];
  const twoCycles: [SingleMove, SingleMove, number][] = [];
  const typeMap: NodeMap<NodeType> = [{}, {}];

  function pruneWinloseInvolvingOneCycles() {
    const {
      typeMap: typeMap_,
      evenLoops: evenLoops_,
      loopMap: _loopMap,
    } = pruneWinLoseNodes(graphs);
    for (const pos of [0, 1] as NodePos[]) {
      Object.assign(typeMap[pos], typeMap_[pos]);
    }
    evenLoops.push(...evenLoops_);
    Object.assign(loopMap, _loopMap);
  }
  function removeEvenLoops() {
    const evenLoops_ = graphs.getGraph("route").getEvenLoops();
    evenLoops_.map(([start, end, num]) =>
      graphs.transferEdge("route", "removed", start, end, num),
    );
    evenLoops.push(...evenLoops_);
  }
  function removeTwoCycles() {
    const twoCycles_ = graphs.getGraph("route").getTwoCycles();

    twoCycles_.map((e) => {
      graphs.transferEdge("route", "removed", e[0][0], e[0][1], e[2]);
      graphs.transferEdge("route", "removed", e[1][0], e[1][1], e[2]);
    });

    twoCycles.push(...twoCycles_);
  }
  pruneWinloseInvolvingOneCycles();
  removeEvenLoops();
  removeTwoCycles();
  pruneWinloseInvolvingOneCycles();

  return { graphs, typeMap, evenLoops, twoCycles, loopMap };
}

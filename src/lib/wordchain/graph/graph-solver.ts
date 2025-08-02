import { toNestedRecord } from "@/lib/utils";
import type { ChangeFunc } from "@/types/rule";
import type {
  ComparisonData,
  ComparisonMap,
  MoveClass,
  MoveType,
  RouteCharListData,
} from "@/types/search";
import { range, round, sum } from "lodash";
import { EdgeMap } from "../classes/edge-map";
import {
  hasDepthMap,
  moveTypeToNodeTypes,
  nodeTypesToMoveType,
} from "../constants";
import { BipartiteDiGraph, getOppos } from "./bipartite-digraph";
import { classify, getDepthMap } from "./classify";
import type {
  NodeMap,
  NodeName,
  NodePos,
  NodeType,
  NormalizedNodeType,
} from "./graph";
import { GraphPartitions } from "./graph-partitions";
import { PairManager } from "./pair-manager";

export class GraphSolver {
  graphs: GraphPartitions;
  typeMap: NodeMap<NodeType>;
  depthMap: NodeMap<number>;
  loopMap: Record<NodeName, NodeName>;
  pairManager: PairManager;
  scc: [NodeName[], NodeName[]][];

  constructor(graph: BipartiteDiGraph) {
    const { graphs, typeMap, evenLoops, twoCycles, loopMap } = classify(graph);
    this.graphs = graphs;
    this.typeMap = typeMap;
    this.loopMap = loopMap;
    this.pairManager = PairManager.fromData(evenLoops, twoCycles);

    // depth 구하기
    this.depthMap = getDepthMap(this.graphs.getGraph("winlose"), this.typeMap);

    // Set all nodeDataValue.type that are undefined to "route"
    for (const pos of [0, 1] as const) {
      for (const node of this.graphs.getGraph("route").nodes(pos)) {
        if (!this.typeMap[pos][node]) {
          this.typeMap[pos][node] = "route";
        } else {
          throw new Error("fucking error");
        }
      }
    }

    this.scc = this.graphs.getGraph("route").getSCC();
  }
  static fromObj(obj: GraphSolver): GraphSolver {
    const result: GraphSolver = Object.create(GraphSolver.prototype);
    const { graphs, typeMap, depthMap, scc, pairManager, loopMap } = obj;
    Object.assign(result, {
      graphs: GraphPartitions.fromObj(graphs),
      pairManager: PairManager.fromObj(pairManager),
      typeMap,
      depthMap,
      loopMap,
      scc,
    });

    return result;
  }

  getWinloseNodes(
    type: "win" | "lose" | "loopwin",
    view: NodePos,
  ): { depth: number; nodes: NodeName[] }[] {
    const result: { depth: number; nodes: NodeName[] }[] = [];
    const winloseNodes = Object.keys(this.typeMap[view]).filter(
      (e) => this.typeMap[view][e] === type,
    );

    const temp: Record<number, string[]> = {};

    for (const node of winloseNodes) {
      const depth = this.depthMap[view][node];
      (temp[depth] ??= []).push(node);
    }

    for (const [depth, nodes] of Object.entries(temp)) {
      nodes.sort();
      result.push({ depth: Number(depth), nodes });
    }
    result.sort((a, b) => a.depth - b.depth);

    return result;
  }
  getRouteNodes(pos: NodePos): RouteCharListData {
    const scc = this.scc.map((nodes) => nodes[pos]).filter((e) => e.length > 0);

    const result: [NodeName[], NodeName[]] = [[], []];
    for (const comp of scc) {
      result[Number(comp.length < 3)].push(...comp);
    }

    for (const e of result) {
      e.sort();
    }
    return result;
  }

  getMaxMinRouteNum(pos: NodePos) {
    const scc = this.scc.map((nodes) => nodes[pos]).filter((e) => e.length > 0);

    const result: [number, number] = [0, 0];
    for (const comp of scc) {
      result[Number(comp.length < 3)] += comp.length;
    }

    return [
      { type: "max", num: result[0], fill: "var(--color-route)" },
      {
        type: "min",
        num: result[1],
        fill: "color-mix(in oklch, var(--color-route) 70%, transparent)",
      },
    ];
  }
  getNodeTypeNum(pos: NodePos) {
    const nodes = Object.keys(this.typeMap[pos]);
    const result: Record<NodeType, number> = {
      win: 0,
      lose: 0,
      route: 0,
      loopwin: 0,
    };
    for (const node of nodes) {
      result[this.typeMap[pos][node]]++;
    }

    return [
      { nodeType: "win", num: result.win, fill: "var(--color-win)" },
      { nodeType: "lose", num: result.lose, fill: "var(--color-lose)" },
      {
        nodeType: "loopwin",
        num: result.loopwin,
        fill: "var(--color-loopwin)",
      },
      { nodeType: "route", num: result.route, fill: "var(--color-route)" },
    ];
  }

  getWinloseDetailNumData(
    pos: NodePos,
  ): { depth: number; num: number; type: "win" | "lose"; fill: string }[] {
    const winloseNodes = Object.keys(this.typeMap[pos]).filter(
      (e) => normalizeNodeType(this.typeMap[pos][e]) !== "route",
    );

    const temp: Record<number, number> = {};

    for (const node of winloseNodes) {
      const depth = this.depthMap[pos][node];
      temp[depth] = (temp[depth] ?? 0) + 1;
    }

    return Object.entries(temp).map(([depth, num]) => {
      const depthNum = Number(depth);
      const type = depthNum % 2 === 1 ? "win" : "lose";
      return {
        depth: depthNum,
        num,
        type: type,
        fill: `var(--color-${type})`,
      };
    });
  }

  getWinningOptimalMove(
    pos: NodePos,
    node: NodeName,
    changeFunc?: ChangeFunc,
  ): [NodeName, NodeName] {
    const nodeType = this.getNodeType(node, pos, changeFunc);

    if (nodeType !== "win" && nodeType !== "loopwin") {
      throw new Error(`(${pos}, ${node}) is not winning node`);
    }
    const graph = this.graphs.getGraph("winlose");
    if (pos === 1) {
      if (this.typeMap[1][node] === "loopwin") {
        return [node, this.loopMap[node]];
      } else {
        const succ = graph
          .successors(1, node)
          .filter((e) => normalizeNodeType(this.typeMap[0][e]) === "lose");

        return [
          node,
          succ.reduce((prev, curr) => {
            if (this.depthMap[0][prev] < this.depthMap[0][curr]) {
              return prev;
            } else {
              return curr;
            }
          }, succ[0]),
        ];
      }
    } else {
      if (graph.hasNode(0, node)) {
        const succ = graph
          .successors(0, node)
          .filter((e) => normalizeNodeType(this.typeMap[1][e]) === "win");

        return this.getWinningOptimalMove(
          1,
          succ.reduce((prev, curr) => {
            if (this.depthMap[1][prev] < this.depthMap[1][curr]) {
              return prev;
            } else {
              return curr;
            }
          }, succ[0]),
          changeFunc,
        );
      } else {
        const moveViewNodes = this.graphs.getMoveViewNodes(
          pos,
          node,
          0,
          changeFunc,
        );

        return this.getWinningOptimalMove(
          1,
          moveViewNodes.reduce((prev, curr) => {
            if (this.depthMap[1][prev] < this.depthMap[1][curr]) {
              return prev;
            } else {
              return curr;
            }
          }, moveViewNodes[0]),
          changeFunc,
        );
      }
    }
  }
  getLosingOptimalMove(
    pos: NodePos,
    node: NodeName,
    changeFunc?: ChangeFunc,
  ): [NodeName, NodeName] | undefined {
    const graph = this.graphs.getGraph("winlose");
    if (pos === 1) {
      if (this.typeMap[1][node]) {
        if (this.depthMap[1][node] === 0 || this.depthMap[1][node] === 1) {
          return undefined;
        } else {
          const succ = graph
            .successors(1, node)
            .filter((s) => s !== this.loopMap[node]);

          return [
            node,
            succ.reduce((prev, curr) => {
              if (this.depthMap[0][prev] > this.depthMap[0][curr]) {
                return prev;
              } else {
                return curr;
              }
            }, succ[0]),
          ];
        }
      } else return undefined;
    } else {
      if (this.typeMap[0][node]) {
        const succ = graph.successors(0, node);
        return this.getLosingOptimalMove(
          1,
          succ.reduce((prev, curr) => {
            if (this.depthMap[0][prev] > this.depthMap[0][curr]) {
              return prev;
            } else {
              return curr;
            }
          }, succ[0]),
          changeFunc,
        );
      } else {
        const moveViewNodes = this.graphs.getMoveViewNodes(
          pos,
          node,
          0,
          changeFunc,
        );
        if (moveViewNodes.length === 0) {
          return undefined;
        }
        return this.getLosingOptimalMove(
          1,
          moveViewNodes.reduce((prev, curr) => {
            if (this.depthMap[1][prev] < this.depthMap[1][curr]) {
              return prev;
            } else {
              return curr;
            }
          }, moveViewNodes[0]),
          changeFunc,
        );
      }
    }
  }

  getNodeType(node: string, pos: 0 | 1, changeFunc?: ChangeFunc): NodeType {
    if (this.typeMap[pos][node]) {
      return this.typeMap[pos][node];
    }

    const nodes = this.graphs.getMoveViewNodes(pos, node, 0, changeFunc);

    const nextTypes = nodes.map((e) => this.typeMap[1][e]);

    if (nextTypes.some((e) => e === "win" || e === "loopwin")) {
      return "win";
    } else if (nextTypes.some((e) => e === "route")) {
      return "route";
    } else {
      return "lose";
    }
  }

  classifyMoves(moveMap: EdgeMap<number[]>): MoveClass {
    const moveClass: MoveClass = range(6).map(() => []);

    for (const [head, tail, idxArr] of moveMap.toArray()) {
      const headType = this.typeMap[1][head];
      const tailType = this.typeMap[0][tail];
      for (const idx of idxArr) {
        const { type, depth, pair } = this.getMoveType(head, tail, idx);

        const moveInfo = moveClass[type];

        const moveInfoMap = (moveInfo[depth ?? 0] ??= new EdgeMap<{
          nodeTypes: [NodeType, NodeType];
          wordIdx: number[];
          pairs: [NodeName, NodeName, number][];
        }>());

        const info = moveInfoMap.get(head, tail, {
          nodeTypes: [headType, tailType],
          wordIdx: [],
          pairs: [],
        });
        info.wordIdx.push(idx);
        if (pair) {
          info.pairs.push(pair);
        }
      }
    }
    return moveClass;
  }

  getSccData(
    pos: NodePos,
    asc: boolean,
  ): {
    nodes: NodeName[];
    succ: { nodes: NodeName[]; by: [NodeName, NodeName, [number, number]][] }[];
  }[] {
    const routeGraph = this.graphs.getGraph("route");
    const [G, , members] = routeGraph.condensation(this.scc, pos);

    const oppos: NodePos = (1 - pos) as NodePos;
    for (const member of Object.values(members))
      member.sort((prev, curr) => {
        const twoStepSuccPrev = routeGraph
          .successors(pos, prev)
          .map((e) => routeGraph.successors(oppos, e))
          .flat();

        const twoStepPredPrev = routeGraph
          .predecessors(pos, prev)
          .map((e) => routeGraph.predecessors(oppos, e))
          .flat();

        const twoStepSuccCurr = routeGraph
          .successors(pos, curr)
          .map((e) => routeGraph.successors(oppos, e))
          .flat();

        const twoStepPredCurr = routeGraph
          .predecessors(pos, curr)
          .map((e) => routeGraph.predecessors(oppos, e))
          .flat();

        if (
          twoStepSuccPrev.length + twoStepPredPrev.length >
          twoStepSuccCurr.length + twoStepPredCurr.length
        ) {
          return -1;
        } else {
          return 1;
        }
      });

    const result: ReturnType<typeof this.getSccData> = [];
    const nodes = G.sortByDistanceFromSink();
    if (asc) {
      nodes.reverse();
    }
    for (const index of nodes) {
      const nextIndices = G.successors(index);
      const data = {
        nodes: members[index],
        succ: nextIndices.map((e) => {
          return {
            nodes: members[e],
            by: G.getProp(index, e)!
              .edges.toArray()
              .map(
                ([start, end]) =>
                  [
                    start,
                    end,
                    this.graphs.getEdgeIdxRange(start, end, "route"),
                  ] as [string, string, [number, number]],
              ),
          };
        }),
      };
      result.push(data);
    }

    return result;
  }
  getComparisonMap(
    solver: GraphSolver,
    changeFunc: ChangeFunc,
  ): [
    Record<NodeName, [NodeType, NodeType]>,
    Record<NodeName, [NodeType, NodeType]>,
  ] {
    const result: [
      Record<NodeName, [NodeType, NodeType]>,
      Record<NodeName, [NodeType, NodeType]>,
    ] = [{}, {}];

    const nodes = [0, 1].map((pos) =>
      Array.from(
        new Set([
          ...Object.keys(this.typeMap[pos]),
          ...Object.keys(solver.typeMap[pos]),
        ]),
      ),
    );

    for (const pos of [0, 1] as NodePos[]) {
      for (const node of nodes[pos]) {
        const before = this.getNodeType(node, pos, changeFunc);
        const after = solver.getNodeType(node, pos, changeFunc);
        if (before !== after) {
          result[pos][node] = [before, after];
        }
      }
    }
    return result;
  }
  getChangeablesCharsData(
    node: NodeName,
    changeFunc: ChangeFunc,
  ): {
    from: [NodeName, NodeType][];
    to: [NodeName, NodeType][];
  } {
    const backwardChars = changeFunc.backward(node);
    const forwardChars = changeFunc.forward(node);
    return {
      from: backwardChars.map((e) => [e, this.getNodeType(e, 0, changeFunc)]),
      to: forwardChars.map((e) => [e, this.getNodeType(e, 1, changeFunc)]),
    };
  }

  getMaxRouteInfo(view: NodePos) {
    const maxNodes: [Set<NodeName>, Set<NodeName>] = [new Set(), new Set()];
    for (const comp of this.scc) {
      if (comp[0].length + comp[1].length >= 3) {
        comp[0].forEach((e) => maxNodes[0].add(e));
        comp[1].forEach((e) => maxNodes[1].add(e));
      }
    }
    const maxGraph = this.graphs.getGraph("route").getInducedSubgraph(maxNodes);

    const charNum = maxGraph.nodes(view).length;
    const moveNum = maxGraph.edges(1).reduce((pred, curr) => pred + curr[2], 0);

    let averageNum = 0;

    if (view === 0) {
      for (const node1 of maxGraph.nodes(1)) {
        const outDeg = maxGraph
          .successors(1, node1)
          .reduce((prev, curr) => prev + maxGraph.getEdgeNum(node1, curr), 0);
        const inDeg = maxGraph.inDegree(1, node1);
        averageNum += inDeg * outDeg;
      }
    } else {
      for (const node1 of maxGraph.nodes(1)) {
        const outDeg = maxGraph
          .successors(1, node1)
          .reduce((prev, curr) => prev + maxGraph.getEdgeNum(node1, curr), 0);
        averageNum += outDeg;
      }
    }
    averageNum /= maxGraph.nodes(view).length;
    averageNum = round(averageNum, 3);
    return { charNum, moveNum, averageNum };
  }
  getWordTypeNum(): {
    typeNum: number[];
    subtypeNum: [NodeType, NodeType, number][][];
  } {
    const typeNum: number[] = [0, 0, 0, 0, 0, 0];

    const removed = this.graphs
      .getGraph("removed")
      .edges(1)
      .reduce((prev, curr) => prev + curr[2], 0);
    typeNum[2] = removed;
    const edges = [
      ...this.graphs.getGraph("route").edges(1),
      ...this.graphs.getGraph("winlose").edges(1),
    ];
    const typeCounter: Record<NodeType, Record<NodeType, number>>[] =
      moveTypeToNodeTypes.map((e) => toNestedRecord(e));

    for (const [start, end, num] of edges) {
      const startType = this.getNodeType(start, 1);
      const endType = this.getNodeType(end, 0);

      const { type: moveType } = this.getUnremovedMoveType(start, end);
      typeNum[moveType] += num;
      typeCounter[moveType][startType][endType] += num;
    }

    const subtypeNum = moveTypeToNodeTypes.map((subTypes, moveType) =>
      subTypes.map(
        (nodeTypes) =>
          [...nodeTypes, typeCounter[moveType][nodeTypes[0]][nodeTypes[1]]] as [
            NodeType,
            NodeType,
            number,
          ],
      ),
    );

    return { typeNum, subtypeNum };
  }
  getUnremovedMoveType(
    start: NodeName,
    end: NodeName,
  ): { type: MoveType; depth?: number } {
    const headType = this.typeMap[1][start];
    const tailType = this.typeMap[0][end];
    if (headType === "loopwin" && tailType === "loopwin") {
      if (this.loopMap[start] === end) {
        return { type: 0, depth: this.depthMap[0][end] + 1 };
      } else {
        return { type: 5, depth: this.depthMap[0][end] };
      }
    }
    const moveType: MoveType = nodeTypesToMoveType[headType][
      tailType
    ] as MoveType;
    if (hasDepthMap[moveType]) {
      return {
        type: moveType,
        depth: this.depthMap[0][end],
      };
    } else {
      return { type: moveType };
    }
  }
  getMoveType(
    start: NodeName,
    end: NodeName,
    idx: number,
  ): { type: MoveType; pair?: [NodeName, NodeName, number]; depth?: number } {
    if (idx < this.graphs.getGraph("removed").getEdgeNum(start, end)) {
      return { type: 2, pair: this.pairManager.getPairIdx(start, end, idx) };
    } else {
      return this.getUnremovedMoveType(start, end);
    }
  }

  getDistributionMap(
    type: NodeType,
    view: NodePos,
    direction: 0 | 1,
  ): Record<NodeName, [number, number, number, number, number, number]> {
    const removedEdges = this.graphs.getGraph("removed").edges(1);
    const unremovedEdges = [
      ...this.graphs.getGraph("route").edges(1),
      ...this.graphs.getGraph("winlose").edges(1),
    ];
    const nodeMap: Record<
      NodeName,
      [number, number, number, number, number, number]
    > = {};
    const oppos = getOppos(view);

    for (const [node, nodeType] of Object.entries(this.typeMap[view])) {
      if (type === nodeType) {
        nodeMap[node] = [0, 0, 0, 0, 0, 0];
      }
    }

    for (const e of removedEdges) {
      if ((direction ^ view) === 1) {
        if (!nodeMap[e[direction]]) continue;
        nodeMap[e[direction]][2] += e[2];
      } else {
        const targets =
          direction === 0
            ? this.graphs.predecessors(oppos, e[direction])
            : this.graphs.successors(oppos, e[direction]);
        for (const node of targets) {
          if (!nodeMap[node]) continue;
          nodeMap[node][2] += e[2];
        }
      }
    }

    for (const e of unremovedEdges) {
      const { type: moveType } = this.getUnremovedMoveType(e[0], e[1]);
      if ((direction ^ view) === 1) {
        if (!nodeMap[e[direction]]) continue;
        nodeMap[e[direction]][moveType] += e[2];
      } else {
        const targets =
          direction === 0
            ? this.graphs.predecessors(oppos, e[direction])
            : this.graphs.successors(oppos, e[direction]);
        for (const node of targets) {
          if (!nodeMap[node]) continue;
          nodeMap[node][moveType] += e[2];
        }
      }
    }

    return nodeMap;
  }
  getDistribution(
    type: NodeType,
    view: NodePos,
    direction: 0 | 1,
    sort: { key: "total" | MoveType; desc: boolean },
    displayType: "number" | "fraction", // 👈 기본값 추가
  ): {
    char: string;
    num: [number, number, number, number, number, number];
  }[] {
    let result = Object.entries(
      this.getDistributionMap(type, view, direction),
    ).map(([nodeName, num]) => ({ char: nodeName, num }));
    // ✅ 비율로 보기 처리
    if (displayType === "fraction") {
      result = result.map(({ char, num }) => {
        const total = num.reduce((a, b) => a + b, 0);
        return {
          char,
          num:
            total === 0
              ? (num.map(() => 0) as typeof num)
              : (num.map((n) => n / total) as typeof num),
        };
      });
    }

    // ✅ 정렬
    result.sort((a, b) => {
      const getValue = (x: typeof a) =>
        sort.key === "total"
          ? x.num.reduce((a, b) => a + b, 0)
          : x.num[sort.key];

      return getValue(a) - getValue(b);
    });

    if (sort.desc) result.reverse();

    return result;
  }
  getDistributionWithCalc(
    type: NodeType,
    view: NodePos,
    wordTypes: [MoveType | "total", MoveType | "total"],
    desc: boolean,
    calcType: "ratio" | "difference",
  ): { char: NodeName; num: [number, number, number] }[] {
    const distributionMaps: Record<NodeName, number>[] = (
      [0, 1] as (0 | 1)[]
    ).map((direction) => {
      const dMap = this.getDistributionMap(type, view, direction as 0 | 1);
      const result: Record<NodeName, number> = {};
      for (const [node, val] of Object.entries(dMap)) {
        const type = wordTypes[direction];
        if (type === "total") {
          result[node] = sum(val);
        } else {
          result[node] = val[type];
        }
      }
      return result;
    });
    const nodes = Object.keys(distributionMaps[0]);
    const result: {
      char: NodeName;
      num: [number, number, number];
    }[] = [];
    for (const node of nodes) {
      result.push({
        char: node,
        num: [
          distributionMaps[1][node],
          distributionMaps[0][node],
          calcType === "ratio"
            ? distributionMaps[1][node] / distributionMaps[0][node]
            : distributionMaps[1][node] - distributionMaps[0][node],
        ],
      });
    }
    result.sort((a, b) => a.num[2] - b.num[2]);
    if (desc === true) {
      result.reverse();
    }

    return result;
  }
}

export function sortEdges(edges: string[][] | [string, string, number][]) {
  return edges.sort(
    (a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]),
  );
}

export function normalizeNodeType(type: NodeType): NormalizedNodeType {
  if (type === "loopwin") {
    return "win";
  }
  return type;
}

export function getComparisonData(
  mapping: ComparisonMap,
): [ComparisonData, ComparisonData] {
  const result: [ComparisonData, ComparisonData] = [[], []];
  const temp: [EdgeMap<NodeName[]>, EdgeMap<NodeName[]>] = [
    new EdgeMap(),
    new EdgeMap(),
  ];

  for (const pos of [0, 1] as NodePos[]) {
    for (const [node, [before, after]] of Object.entries(mapping[pos])) {
      temp[pos].get(before, after, []).push(node);
    }
    for (const before of ["win", "lose", "loopwin", "route"] as NodeType[]) {
      for (const after of ["win", "lose", "loopwin", "route"] as NodeType[]) {
        if (before !== after)
          result[pos].push([before, after, temp[pos].get(before, after, [])]);
      }
    }
  }
  return result;
}
